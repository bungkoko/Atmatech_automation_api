/// <reference types="cypress" />
const Chance = require('chance');
const chance = new Chance();


describe('API Testing ATMATECH', () => {
    let idkeyword;
    const fakeUsername = chance.word({ length: 8 });
    const fakeFullName = chance.name();
    const fakeEmail = chance.email();

    const validUsername = Cypress.env('Username');
    const validPassword = Cypress.env('Password');
    const invalidUsername = Cypress.env('invalidPassword');
    const invalidPassword = Cypress.env('invalidPassword');
    //const baseUrl = Cypress.config('baseURL');

    const api_baseURL = 'https://qc-test.atmatech.id/api'
    let token;

    context("Login Endpoint", () => {
        //Positive Case
        it("Positive Case: Login with valid credential", () => {
            cy.request({
                method: 'POST',
                url: `${api_baseURL}/login`,
                body: {
                    username: validUsername,
                    password: validPassword
                }
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('accessToken');
                token = response.body.accessToken;
            })
        })

        it('Negative Case: Login with invalid credential', () => {
            cy.request({
                method: 'POST',
                url: 'https://qc-test.atmatech.id/api/login',
                body: {
                    username: invalidUsername,
                    password: invalidPassword
                    ,
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body).to.have.property('message', 'Nama pengguna atau kata sandi salah.');
            })
        })
    })

    context('User Detail Login', () => {
        it('Positive Case: Get User Detail with valid access token', () => {
            cy.request({
                method: 'GET',
                url: 'https://qc-test.atmatech.id/api/me/',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('_id');
                expect(response.body).to.have.property('username');
            })
        })

        it('Negative Case: Access API User detail without token', () => {
            cy.request({
                method: 'GET',
                url: `${api_baseURL}/me`,
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(401)
                expect(response.body).to.have.property('message', 'Unauthorized');
            });
        });

        it('Negative Case: Unauthorized access to Detail', () => {
            cy.request({
                method: 'GET',
                url: 'https://qc-test.atmatech.id/api/me/',
                headers: {
                    Authorization: 'Bearer invalidToken'
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(401)
                expect(response.body).to.have.property('message', 'Unauthorized')
            })
        })

        it('Negative Case: Access Invalid Endpoint', () => {
            cy.request({
                method: 'GET',
                url: `${api_baseURL}/mee/`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(404),
                    expect(response.body).to.have.property('message', 'Not Found')
            })
        })


    });

    context('Users List Endpoint', () => {
        it('Positive Case: Get data User based on criteria', () => {
            const validCriteria = {
                q: '',
                role: 'user',
                page: 1,
                limit: 10,
            };
            cy.request({
                method: 'GET',
                url: 'https://qc-test.atmatech.id/api/user/',
                headers: {
                    Authorization: `Bearer ${token}`,

                },
                qs: validCriteria,

            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('limit');
                expect(response.body).to.have.property('page');
                expect(response.body).to.have.property('pages');
                expect(response.body).to.have.property('result');
                expect(response.body).to.have.property('total');
            });
        });

        it('Negative Case: Access API user list without token', () => {
            cy.request({
                method: 'GET',
                url: `${api_baseURL}/user/`,
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(401);
                expect(response.body).to.have.property('message', 'Unauthorized');
            });
        });

        it('Negative Case: Access API user list with invalid token', () => {
            const invalidToken = 'invalidtoken';
            cy.request({
                method: 'GET',
                url: `${api_baseURL}/user/`,
                headers: {
                    Authorization: `Bearer ${invalidToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(401);
                expect(response.body).to.have.property('message', 'Unauthorized');
            });
        });

        it('Negative Case: Use invalid parameter', () => {
            const invalidParam = {
                q: 'invalidnama',
                role: 'invalid_role',
                page: 'invalid_page',
                limit: 'invalid_limit',

            };

            cy.request({
                method: 'GET',
                url: `${api_baseURL}/user/`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                qs: invalidParam,
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(400);
            })
        })

        it('Negative Case: Access Invalid Endpoint', () => {
            cy.request({
                method: 'GET',
                url: `${api_baseURL}/users/`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(404),
                    expect(response.body).to.have.property('message', 'Not Found')
            })
        })
    })

    context('User Create Endpoint', () => {


        //newUser.append('avatar','image/checklist.jpg');

        it('Positive Case: User Created successfully', () => {
            const newUser = new FormData();
            newUser.append('email', fakeEmail);
            newUser.append('username', fakeUsername);
            newUser.append('fullName', fakeFullName);
            newUser.append('password', 'Password123!');
            newUser.append('role', 'user')


            cy.request({
                method: 'POST',
                url: `${api_baseURL}/user/`,
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                body: newUser,

            }).then((response) => {
                cy.log('Username : ' + fakeUsername);
                cy.log('Email : ' + fakeEmail);
                cy.log('FullName : ' + fakeFullName);
                expect(response.status).to.eq(200);
                //expect(response.body).to.have.property('username',fakeUsername)

            })

            //Check Response
            const criteria = {
                q: `${fakeUsername}`,
                role: 'user',
                page: 1,
                limit: 10,
            };
            cy.request({
                method: 'GET',
                url: 'https://qc-test.atmatech.id/api/user/',
                headers: {
                    Authorization: `Bearer ${token}`,

                },
                qs: criteria,

            }).then((response) => {
                expect(response.status).to.eq(200);
                //find object with username
                const user = response.body.result.find(user => user.username === `${fakeUsername}`);
                //captureUserID = response.body.result.find(user => user._id);
                expect(user).to.exist;
                expect(user).to.have.property('_id');
                expect(user).to.have.property('email', fakeEmail);
            });

        });

        it('Negative Case : Create user with missing required fields', () => {
            const invalidUser = {
                email: chance.email()                //Missing username, fullname, password, and role
            };

            cy.request({
                method: 'POST',
                url: `${api_baseURL}/user/`,
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                body: invalidUser,
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body).to.have.property('message');

            })
        })

        it('Negaticve Case: Create user with invalid password', () => {
            const invalidPasswordUser = {
                email: chance.email(),
                username: chance.word({ length: 8 }),
                fullName: chance.name(),
                password: 'password123',
                role: 'user',
            };

            cy.request({
                method: 'POST',
                url: `${api_baseURL}/user/`,
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                body: invalidPasswordUser,
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body).to.have.property('message');
            });
        });
    })
    context('User Get By Id', () => {
        it('Positive Case: Successfully Get User by ID', () => {
            const id = '6550514c92e5662894473deb';

            cy.request({
                method: 'GET',
                url: `${api_baseURL}/user/${id}`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('_id', id);

            })
        })

        it('Negative Case: User ID Not Found', () => {
            const id = '6550514c92e5662894473debw';

            cy.request({
                method: 'GET',
                url: `${api_baseURL}/user/${id}`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body).to.have.property('message', 'ID pengguna tidak valid.');

            })

        })
    })
    context('User Update', () => {
        const id = '6550514c92e5662894473deb';

        it('Positive Case: Successfully Update Data User', () => {
            const updateEmail = chance.email();
            const updateUsername = chance.word({ length: 8 });
            const updateFullname = chance.name();

            const UpdateUser = new FormData();
            UpdateUser.append('email', updateEmail);
            UpdateUser.append('username', updateUsername);
            UpdateUser.append('fullName', updateFullname);

            cy.request({
                method: 'PUT',
                url: `${api_baseURL}/user/${id}`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: UpdateUser,
            }).then((response) => {
                cy.log('Username : ' + updateUsername);
                cy.log('Email : ' + updateEmail);
                cy.log('FullName : ' + updateFullname);

                expect(response.status).to.eq(200);
                // expect(response.body).to.have.property('_id', id);

            })
        })

        it('Negative Case: Update User with invalid ID', () => {
            const id = '6550514c92e5662894473debw';

            const updateEmail = chance.email();
            const updateUsername = chance.word({ length: 8 });
            const updateFullname = chance.name();

            const UpdateUser = new FormData();
            UpdateUser.append('email', updateEmail);
            UpdateUser.append('username', updateUsername);
            UpdateUser.append('fullName', updateFullname);

            cy.request({
                method: 'PUT',
                url: `${api_baseURL}/user/${id}`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: UpdateUser,
                failOnStatusCode: false,
            }).then((response) => {
                //cy.log('coba capture id:'+captureUserID);
                expect(response.status).to.eq(400);
                //expect(response.body).to.have.property('message', 'ID pengguna tidak valid.');
            })
        })

        it('Negative Case: Update User with missing required fields', () => {
            const id = '6550514c92e5662894473deb';
            const UpdateUser = {
                //tidak menyertakan email, username, fullname, role
            };

            cy.request({
                method: 'PUT',
                url: `${api_baseURL}/user/${id}`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: UpdateUser,
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(400);
            })

        })

    })

    context('Delete User', () => {
        let idUser;
        it('Positive Case: Delete User', () => {
            const criteria = {
                q: `${fakeUsername}`,
                role: 'user',
                page: 1,
                limit: 10,
            };
            cy.request({
                method: 'GET',
                url: 'https://qc-test.atmatech.id/api/user/',
                headers: {
                    Authorization: `Bearer ${token}`,

                },
                qs: criteria,

            }).then((response) => {
                expect(response.status).to.eq(200);
                //find object with username
                const user = response.body.result.find(user => user.username === `${fakeUsername}`);
                //captureUserID = response.body.result.find(user => user._id);
                idUser = user._id;
                cy.wrap(idUser).as('idUser');
            });

            cy.get('@idUser').then((userId) => {
                cy.request({
                    method: 'DELETE',
                    url: `${api_baseURL}/user/${userId}`,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }).then((deleteResponse) => {
                    expect(deleteResponse.status).to.eq(200);
                })
            })
        })

        it('Negative Case: Delete User with invalid ID', () => {
            const invalidUserId = '6550514c92e5662894473debq';

            cy.request({
                method: 'DELETE',
                url: `${api_baseURL}/user/${invalidUserId}`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(400);
            })
        })
    })

    context('Keyword List', () => {
        it('Positive Case: Get Keyword List with valid parameter', () => {
            const params = {
                q: 'Rosie Tran',
                active: 'true',
                type: 'public',
            }

            cy.request({
                method: 'GET',
                url: `${api_baseURL}/keyword/`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: params,
            }).then((response) => {
                idkeyword = response.body._id
                cy.wrap(idkeyword).as('idKeyword');
                expect(response.status).to.eq(200);
            })
        })
        it('Negative Case - Get Keyword List with Invalid Parameters', () => {
            const params = {
                // Invalid parameters, missing required parameters, etc.
            };

            cy.request({
                method: 'GET',
                url: `${api_baseURL}/keyword/`,
                failOnStatusCode: false, // Allow non-2xx responses
                qs: params,
            }).then((response) => {
                expect(response.status).to.eq(401);
            });
        });
    })

    context('Create Keyword', () => {
        it('Positive Case - Create Keyword with Valid Body', () => {
            const requestBody = {
                keyword: fakeFullName,
                status: true,
                type: 'public',
            };

            cy.request({
                method: 'POST',
                url: `${api_baseURL}/keyword/`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },

                body: requestBody,
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.equal(200);
                expect(response.body).to.have.property('keyword').and.equal(requestBody.keyword.toLowerCase());
            });
        });

        it('Negative Case - Create Keyword with Invalid Body', () => {
            const invalidRequestBody = {
                // Invalid body, missing required fields, etc.
            };

            cy.request({
                method: 'POST',
                url: `${api_baseURL}/keyword/`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: invalidRequestBody,
                failOnStatusCode: false,
            })
                .its('status')
                .should('equal', 400);
        });

    })

    context('Keyword by ID', () => {
       
        it('Positive Case - Get Keyword by ID with Valid ID', () => {
            // Assuming you have a valid keyword ID, replace 'exampleId' with the actual ID
            //const keywordId = 'exampleId';
            const params = {
                q: fakeFullName,
                active: 'true',
                type: 'public',
            }

            cy.request({
                method: 'GET',
                url: `${api_baseURL}/keyword/`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: params,
            }).then((response) => {
                idkeyword = response.body[0]._id
                cy.wrap(idkeyword).as('idKeyword');
                expect(response.status).to.eq(200);
            })

            cy.get('@idKeyword').then((keywordId) => {
                cy.request({
                    method: 'GET',
                    url: `${api_baseURL}/keyword/${keywordId}`,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }).then((keywordResponse) => {
                    expect(keywordResponse.status).to.eq(200);
                })
            })
        });
        it('Negative Case - Get Keyword by ID with Invalid ID', () => {
            const invalidKeywordId = '6550514c92e5662894473debq';

            cy.request({
                method: 'GET',
                url: `${api_baseURL}/keyword/${invalidKeywordId}`,
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(401);
            });
        });
    })

    context('Keyword Update Status', () => {
      
        it('Positive Case - Update Status Keyword with Valid ID', () => {

            // Assuming you have a valid keyword ID, replace 'exampleId' with the actual ID
            const params = {
                q: fakeFullName,
                active: 'true',
                type: 'public',
            }

            // Assuming you have a valid status, replace 'true' with the actual status
            const status = true;
            cy.request({
                method: 'GET',
                url: `${api_baseURL}/keyword/`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: params,
            }).then((response) => {
                idkeyword = response.body[0]._id
                cy.wrap(idkeyword).as('idKeyword');
                expect(response.status).to.eq(200);
            })


            cy.get('@idKeyword').then((keywordId) => {
                cy.request({
                    method: 'PUT',
                    url: `${api_baseURL}/keyword/${keywordId}/active`,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: { status },
                }).then((keywordResponse) => {
                    expect(keywordResponse.status).to.eq(200);
                })
            })
        });
        it('Negative Case - Update Status Keyword with Invalid ID', () => {
            const invalidKeywordId = 'invalidId';

            // Assuming you have a valid status, replace 'false' with the actual status
            const status = false;

            cy.request({
                method: 'PUT',
                url: `${api_baseURL}/keyword/${invalidKeywordId}/active`,
                headers: {
                    Authorization: `Bearer ${token}`, // Assuming 'token' is defined
                },
                body: { status },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.not.eq(200);
                // Add more assertions based on the expected error response
            });
        })
    })
    context('Update Type Keyword', () => {
      
        it('Positive Case - Update Type Keyword by ID with Valid ID', () => {

            // Assuming you have a valid type, replace 'public' with the actual type
            const newType = 'private';
            //const keywordId = 'exampleId';
            const params = {
                q: '',
                active: 'true',
                type: 'public',
            }

            cy.request({
                method: 'GET',
                url: `${api_baseURL}/keyword/`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: params,
            }).then((response) => {
                idkeyword = response.body[0]._id
                cy.wrap(idkeyword).as('idKeyword');
                expect(response.status).to.eq(200);
            })

            cy.get('@idKeyword').then((keywordId) => {
                cy.request({
                    method: 'PUT',
                    url: `${api_baseURL}/keyword/${keywordId}/type`,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: { type: newType },
                }).then((keywordResponse) => {
                    expect(keywordResponse.status).to.eq(200);
                    expect(keywordResponse.body).to.have.property('type').and.equal(newType);

                })
            })

        });

        it('Negative Case - Update Type Keyword by ID with Invalid ID', () => {
            const invalidKeywordId = 'invalidId';

            // Assuming you have a valid type, replace 'public' with the actual type
            const newType = 'public';

            cy.request({
                method: 'PUT',
                url: `${api_baseURL}/keyword/${invalidKeywordId}/type`,
                headers: {
                    Authorization: `Bearer ${token}`, // Assuming 'token' is defined
                },
                body: { type: newType },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.not.eq(200);
                // Add more assertions based on the expected error response
            });
        });

    })

    context('Delete Keyword', () => {
        
        it('Positive Case - Delete Keyword by ID with Valid ID', () => {
            // Assuming you have a valid keyword ID, replace 'exampleId' with the actual ID
            //const keywordId = 'exampleId';
            const params = {
                q: '',
                active: 'true',
                type: 'public',
            }

            cy.request({
                method: 'GET',
                url: `${api_baseURL}/keyword/`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: params,
            }).then((response) => {
                idkeyword = response.body[0]._id
                cy.wrap(idkeyword).as('idKeyword');
                //expect(response.status).to.eq(200);
            })

            cy.get('@idKeyword').then((keywordId) => {
                cy.request({
                    method: 'DELETE',
                    url: `${api_baseURL}/keyword/${keywordId}`,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }).then((keywordResponse) => {
                    expect(keywordResponse.status).to.eq(200);
                })
            })
        });
        it('Negative Case - Delete Keyword by ID with Invalid ID', () => {
            const invalidKeywordId = 'invalidId';

            cy.request({
                method: 'DELETE',
                    url: `${api_baseURL}/keyword/${invalidKeywordId}`,
                    headers: {
                    Authorization: `Bearer ${token}`, // Assuming 'token' is defined
                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.not.eq(200);
                // Add more assertions based on the expected error response
            });
        });
    })

})