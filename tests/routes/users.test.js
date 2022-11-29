import { describe, it, expect, beforeEach, afterAll, beforeAll } from "vitest";
import app from "../../src/index.js";
import supertest from "supertest";
import { faker } from "@faker-js/faker";
import { userDao } from "../../src/routes/users.js";
import * as db from "../../src/data/db.js";
import * as dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const endpoint = "/users";
const request = new supertest(app);

describe(`Test ${endpoint}`, () => {
  const numUsers = 5;
  let users;

  beforeAll(async () => {
    db.connect(process.env.DB_TEST_URI);
    await userDao.deleteAll();
  });

  beforeEach(async () => {
    await userDao.deleteAll();
    users = [];
    for (let index = 0; index < numUsers; index++) {
      const name = faker.name.fullName();
      const email = faker.internet.email();
      const user = await userDao.create({ name, email });
      users.push(user);
    }
  });

  describe("GET request", () => {
    it("Respond 200", async () => {
      const response = await request.get(endpoint);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(numUsers);
    });
  });

  describe("POST request", () => {
    it("Respond 201", async () => {
      const name = faker.name.fullName();
      const email = faker.internet.email();
      const response = await request.post(endpoint).send({
        name,
        email,
      });
      expect(response.status).toBe(201);
      expect(response.body.data._id).toBeDefined();
      expect(response.body.data.name).toBe(name);
      expect(response.body.data.email).toBe(email);
    });

    describe("Respond 400", () => {
      it("Null name", async () => {
        const name = null;
        const email = faker.internet.email();
        const response = await request.post(endpoint).send({
          name,
          email,
        });
        expect(response.status).toBe(400);
      });

      it("Undefined name", async () => {
        const name = undefined;
        const email = faker.internet.email();
        const response = await request.post(endpoint).send({
          name,
          email,
        });
        expect(response.status).toBe(400);
      });

      it("Empty name", async () => {
        const name = "";
        const email = faker.internet.email();
        const response = await request.post(endpoint).send({
          name,
          email,
        });
        expect(response.status).toBe(400);
      });

      it("Null email", async () => {
        const name = faker.name.fullName();
        const email = null;
        const response = await request.post(endpoint).send({
          name,
          email,
        });
        expect(response.status).toBe(400);
      });

      it("Undefined email", async () => {
        const name = faker.name.fullName();
        const email = undefined;
        const response = await request.post(endpoint).send({
          name,
          email,
        });
        expect(response.status).toBe(400);
      });

      it("Empty email", async () => {
        const name = faker.name.fullName();
        const email = "";
        const response = await request.post(endpoint).send({
          name,
          email,
        });
        expect(response.status).toBe(400);
      });

      it("Invalid email", async () => {
        const name = faker.name.fullName();
        const email = faker.lorem.sentence();
        const response = await request.post(endpoint).send({
          name,
          email,
        });
        expect(response.status).toBe(400);
      });
    });
  });

  describe("GET request given ID", () => {
    it("Respond 200", async () => {
      const index = Math.floor(Math.random() * numUsers);
      const users = await userDao.readAll({});
      const user = users[index];
      const response = await request.get(`${endpoint}/${user.id}`);
      expect(response.status).toBe(200);
      expect(response.body.data._id).toBe(user.id);
      expect(response.body.data.name).toBe(user.name);
      expect(response.body.data.email).toBe(user.email);
    });

    it("Respond 400", async () => {
      const response = await request.get(`${endpoint}/invalid}`);
      expect(response.status).toBe(400);
    });

    it("Respond 404", async () => {
      const response = await request.get(
        `${endpoint}/${mongoose.Types.ObjectId().toString()}`
      );
      expect(response.status).toBe(404);
    });
  });

  describe("PUT request", () => {
    it("Respond 200", async () => {
      const index = Math.floor(Math.random() * numUsers);
      const users = await userDao.readAll({});
      const user = users[index];
      const name = faker.name.fullName();
      const email = faker.internet.email();
      const response = await request.put(`${endpoint}/${user.id}`).send({
        name,
        email,
      });
      expect(response.status).toBe(200);
      expect(response.body.data._id).toBe(user.id);
      expect(response.body.data.name).toBe(name);
      expect(response.body.data.email).toBe(email);
    });

    it("Respond 400", async () => {
      const response = await request.put(`${endpoint}/invalid}`);
      expect(response.status).toBe(400);
    });

    it("Respond 404", async () => {
      const response = await request.put(
        `${endpoint}/${mongoose.Types.ObjectId().toString()}`
      );
      expect(response.status).toBe(404);
    });
  });

  describe("DELETE request", () => {
    it("Respond 200", async () => {
      const index = Math.floor(Math.random() * numUsers);
      const users = await userDao.readAll({});
      const user = users[index];
      const response = await request.delete(`${endpoint}/${user.id}`);
      expect(response.status).toBe(200);
      expect(response.body.data._id).toBe(user.id);
      expect(response.body.data.name).toBe(user.name);
      expect(response.body.data.email).toBe(user.email);
    });

    it("Respond 400", async () => {
      const response = await request.delete(`${endpoint}/invalid}`);
      expect(response.status).toBe(400);
    });

    it("Respond 404", async () => {
      const response = await request.delete(
        `${endpoint}/${mongoose.Types.ObjectId().toString()}`
      );
      expect(response.status).toBe(404);
    });
  });

  afterAll(async () => {
    await userDao.deleteAll();
  });
});
