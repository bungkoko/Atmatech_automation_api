const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "https://qc-test.atmatech.id",
    env: {
    "Username": "superadmin",
    "Password": "Password1!",
    "invalidUsername": "admin12",
    "invalidPassword": "Password1"
  },
  reporter: "cypress-multi-reporters",
  reporterOptions: {
    "configFile": "cypress/reporter-config.json"
  }
  },

  
});
