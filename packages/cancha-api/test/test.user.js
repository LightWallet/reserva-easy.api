process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();

chai.use(chaiHttp);

describe('User HTTP REQUESTS', () => {
  describe('/GET user', () => {
      it('it should GET all the users', (done) => {
        chai.request(server)
            .get('/api/users?limit=10&skip=0')
            .end((err, res) => {
              console.info(res.body);
                res.should.have.status(200);
              done();
            });
      });
  });
});
