import { response } from "express";
import { dbProducts, Products } from "../products";
import { dbUsers, Users } from "../users";
import { dbUserOrderProducts, orderProducts, orders } from "../orders";
import supertest from "supertest";
import app from "../../server";
import exp from "constants";
import { userInfo } from "os";
const request = supertest(app);
const testProduct = new dbProducts();
const testOrder = new dbUserOrderProducts();
const testUsers = new dbUsers();
let token: string | undefined = undefined;
describe("api routes", () => {
  //users route
  beforeAll(async () => {
    const user = {
      firstName: "abdelrahman",
      lastName: "ali",
      username: "abdo",
      password: "123",
    };
    const create = await request.post("/users/create").send(user);
    expect(create.status).toBe(200);
    const auth = await request
      .post("/users/authenticate")
      .send({ username: user.username, password: user.password });
    token = auth.body;
    console.log("auth -> " + token);
    expect(auth.status).toBe(200);
  });
  it("Testing routes without Authoriztion", async () => {
    const users = await request.get("/users");
    const getUserById = await request.get("/users/1");
    const orders = await request.get("/orders");
    const products = await request.get("/products");
    const createProduct = await request
      .post("/products/create")
      .send({ name: "test", price: 123 });
    const createOrder = await request
      .post("/orders/createOrder")
      .send({ userId: "1" });
    const getOrderById = await request.get("/orders/1");
    const getAllOrders = await request.get("/orders");
    const addProductsToOrder = await request
      .post("/orders/addProductsToOrder")
      .send({
        quantity: 1,
        productId: 1,
        orderId: 1,
      });
    expect(users.status).toBe(401);
    expect(orders.status).toBe(401);
    expect(products.status).toBe(401);
    expect(getUserById.status).toBe(401);
    expect(createProduct.status).toBe(401);
    expect(createOrder.status).toBe(401);
    expect(getOrderById.status).toBe(401);
    expect(getAllOrders.status).toBe(401);
    expect(addProductsToOrder.status).toBe(401);
  });
  it("should find product by id", async () => {
    const getProductById = await request.get("/products/1");
    expect(getProductById.status).toBe(200);
  });
  it("create user and authenticate him and show all users", async () => {
    const result = await testUsers.create(
      "testUsername",
      "testFirstname",
      "testLastname",
      "123"
    );
    expect(result.username).toEqual("testUsername");
    expect(result.firstname).toEqual("testFirstname");
    expect(result.lastname).toEqual("testLastname");
    //
    const result1 = await testUsers.authenticate("testUsername", "123");
    console.log("res------------> " + JSON.stringify(result1));
    expect(JSON.stringify(result1?.user_id)).toBeGreaterThanOrEqual(0);
    //
    const result2 = await testUsers.index();
    expect(result2.length).toBeGreaterThanOrEqual(0);
    //
    const result3 = await testUsers.show("1");
    expect(JSON.stringify(result3?.user_id)).toBeGreaterThanOrEqual(1);
  });
  it("should create a new product and show product by id and get all products", async () => {
    const result = await testProduct.create({
      name: "testProduct",
      price: 200,
    });
    expect(result.name).toEqual("testProduct");
    expect(result.price).toEqual(200);
    //
    const result1 = await testProduct.show("1");
    console.log(JSON.stringify(result1));
    expect(JSON.stringify(result1.product_id)).toBeGreaterThanOrEqual(0);
    //
    const result3 = testProduct.index();
    expect((await result3).length).toBeGreaterThanOrEqual(0);
  });
  it("should create order and return all products", async () => {
    const result = await testOrder.create("1");
    console.log("created order =>>>>>> " + JSON.stringify(result));
    expect(JSON.stringify(result.status)).toEqual("false");
    //
    const result1 = await testOrder.index();
    expect(JSON.stringify(result1[0].status)).toEqual("false");
    //
    const result2 = await testOrder.show("1");
    expect(JSON.stringify(result2.status)).toEqual("false");
    //
    const result3 = await testOrder.addProductsToOrder({
      quantity: 1,
      productId: 1,
      orderId: 1,
    });
    console.log("resssssss333333" + JSON.stringify(result3));
    expect(JSON.stringify(result3.quantity)).toEqual("1");
  });
});

//////////////////////////////////////////////////
// describe("usermodel", () => {

// });

// describe("products", () => {
//
// });
// describe("order", () => {
//
// });
