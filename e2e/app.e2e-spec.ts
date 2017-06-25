import { ShopAngular2WebapiPage } from './app.po';

describe('shop-angular2-webapi App', () => {
  let page: ShopAngular2WebapiPage;

  beforeEach(() => {
    page = new ShopAngular2WebapiPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
