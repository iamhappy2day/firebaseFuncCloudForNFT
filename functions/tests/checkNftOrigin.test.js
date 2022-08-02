const fbTest = require("firebase-functions-test")(
  {
    apiKey: "AIzaSyBxc_1ao-Y00uy11gSMmdStY6p3harutsQ",
    authDomain: "walken-test.firebaseapp.com",
    projectId: "walken-test",
    storageBucket: "walken-test.appspot.com",
    messagingSenderId: "522169233347",
    appId: "1:522169233347:web:eae8e68ff060eab3969776",
    measurementId: "G-DBMGSFV311",
  },
  "./service-account.json"
);
const { checkNftOriginal } = require("../index");
const admin = require("firebase-admin");

let app = admin.initializeApp();
jest.setTimeout(30000);

describe("Check checkNftOriginal function", () => {
  test("Check function with original nft address", async () => {
    const req = {
      body: { mintAddress: "5sYajCWGHeM6Ru8FXCU6zhodQ2B9oyYiRJiqxGdYfZoo" },
    };

    const res = {
      status: (status) => {
        expect(status).toBe(200);
        // need to return this because res.status is a chainable method
        return res;
      },
      send: (payload) => {
        expect(payload.status).toBe("Success");
      },
    };

    await checkNftOriginal(req, res);
  });

  test("Check function with fake nft address", async () => {
    const req = {
      body: { mintAddress: "8JWyCQzB3FBXMiZBdLd1L6nYneNaowwffC4DQWd4YEGk" },
    };

    const res = {
      status: (status) => {
        expect(status).toBe(200);
        return res;
      },
      send: (payload) => {
        expect(payload.status).toBe("Attention");
      },
    };

    await checkNftOriginal(req, res);
  });

  test("Check that functions returns error when mint address wasn't provided", async () => {
    const req = {
      body: { mintAddress: "" },
    };

    const res = {
      status: (status) => {
        expect(status).toBe(400);
        return res;
      },
      send: (payload) => {
        expect(payload.status).toBe("Fail");
      },
    };

    await checkNftOriginal(req, res);
  });
});
