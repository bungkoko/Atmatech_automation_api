/// <reference types="cypress" />

describe('API Testing ATMATECH', () => {
    const validUsername = Cypress.env('Username');
    const validPassword = Cypress.env('Password');
    const invalidUsername = Cypress.env('invalidPassword');
    const invalidPassword = Cypress.env('invalidPassword');
    //const baseUrl = Cypress.config('baseURL');
    
    const api_baseURL='https://qc-test.atmatech.id/api'
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
    
    context('User Detail Login',()=>{
        it('Positive Case: Get User Detail with valid access token',()=>{
            cy.request({
                method:'GET',
                url:'https://qc-test.atmatech.id/api/me/',
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }).then((response)=>{
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('_id');
                expect(response.body).to.have.property('username');
            })
        })

        it('Negative Case: Access API User detail without token',()=>{
            cy.request({
                method:'GET',
                url:`${api_baseURL}/me`,
                failOnStatusCode:false,
            }).then((response)=>{
                expect(response.status).to.eq(401)
                expect(response.body).to.have.property('message','Unauthorized');
            });
        });

        it('Negative Case: Unauthorized access to Detail',()=>{
            cy.request({
                method:'GET',
                url:'https://qc-test.atmatech.id/api/me/',
                headers:{
                    Authorization:'Bearer invalidToken'
                },
                failOnStatusCode:false
            }).then((response)=>{
                expect(response.status).to.eq(401)
                expect(response.body).to.have.property('message','Unauthorized')
            })
        })

        it('Negative Case: Access Invalid Endpoint',()=>{
            cy.request({
                method:'GET',
                url:`${api_baseURL}/mee/`,
                headers:{
                    Authorization:`Bearer ${token}`,
                },
                failOnStatusCode:false,
            }).then((response)=>{
                expect(response.status).to.eq(404),
                expect(response.body).to.have.property('message','Not Found')
            })
        })

    
    });
    
    context('Users List Endpoint',()=>{
        it('Positive Case: Get data User based on criteria',()=>{
            const validCriteria={
                q:'',
                role:'user',
                page:1,
                limit:10,
            };
            cy.request({
                method:'GET',
                url:'https://qc-test.atmatech.id/api/user/',
                headers:{
                    Authorization:`Bearer ${token}`,

                },
                qs:validCriteria,

            }).then((response)=>{
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('limit');
                expect(response.body).to.have.property('page');
                expect(response.body).to.have.property('pages');
                expect(response.body).to.have.property('result');
                expect(response.body).to.have.property('total');
            });
        });
        
        it('Negative Case: Access API user list without token',()=>{
            cy.request({
                method:'GET',
                url:`${api_baseURL}/user/`,
                failOnStatusCode:false,
            }).then((response)=>{
                expect(response.status).to.eq(401);
                expect(response.body).to.have.property('message','Unauthorized');
            });
        });

        it('Negative Case: Access API user list with invalid token',()=>{
            const invalidToken='invalidtoken';
            cy.request({
                method:'GET',
                url:`${api_baseURL}/user/`,
                headers:{
                    Authorization: `Bearer ${invalidToken}`,
                },
                failOnStatusCode:false,
            }).then((response)=>{
                expect(response.status).to.eq(401);
                expect(response.body).to.have.property('message','Unauthorized');
            });
        });
        
        it('Negative Case: Use invalid parameter',()=>{
            const invalidParam={
                q:'invalidnama',
                role:'invalid_role',
                page:'invalid_page',
                limit:'invalid_limit',

            };
            
            cy.request({
                method:'GET',
                url:`${api_baseURL}/user/`,
                headers:{
                    Authorization:`Bearer ${token}`,
                },
                qs:invalidParam,
                failOnStatusCode:false,
            }).then((response)=>{
                expect(response.status).to.eq(400);
            })
        })
        
        it('Negative Case: Access Invalid Endpoint',()=>{
            cy.request({
                method:'GET',
                url:`${api_baseURL}/users/`,
                headers:{
                    Authorization:`Bearer ${token}`,
                },
                failOnStatusCode:false,
            }).then((response)=>{
                expect(response.status).to.eq(404),
                expect(response.body).to.have.property('message','Not Found')
            })
        })
    })

    context('User Create Endpoint',()=>{

    })

})