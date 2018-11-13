process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();

chai.use(chaiHttp);

let defaultUser = {
  email: "ascacere92@gmail.com",
  password: "thisisapassword123",
  name: "Andres Caceres",
  phone: "0990279843",
  roleId: 1,
  stateId: 1
}

describe('User HTTP REQUESTS', () => {

  describe('/POST users', () => {

    it('it should create an inactive user', (done) => {
      chai.request(server)
        .post('/api/users/')
        .send({ ...defaultUser })
        .end((err, res) => {
          res.should.have.status(200);
          defaultUser = res.body
          done();
        });
    });
  });

  describe('/GET users', () => {
    it('it should GET all the users', (done) => {
      chai.request(server)
        .get('/api/users?limit=10&skip=0')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });


});
