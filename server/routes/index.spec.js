import supertest from 'supertest';
import app from '<server>/app';

const server = () => supertest(app);

describe('index router', () => {
  it('should display welcome message', (done) => {
    server()
      .get('/')
      .end((err, res) => {
        expect(res.status).toBe(200);
        done();
      });
  });

  it('should return 404 for incorrect route', (done) => {
    server()
      .get('/test')
      .end((err, res) => {
        expect(res.status).toBe(404);
        done();
      });
  });
});
