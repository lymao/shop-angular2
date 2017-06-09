import { ShopAngular2Page } from './app.po';

describe('shop-angular2 App', () => {
  let page: ShopAngular2Page;

  beforeEach(() => {
    page = new ShopAngular2Page();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
