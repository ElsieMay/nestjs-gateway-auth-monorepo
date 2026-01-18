import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(() => {
    service = new AppService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call getHello and return Hello World!', () => {
    const getHelloSpy = jest.spyOn(service, 'getHello');

    const result = service.getHello();

    expect(getHelloSpy).toHaveBeenCalled();
    expect(result).toBe('Hello World!');
  });
});
