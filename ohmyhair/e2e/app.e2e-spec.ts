import { NgOhmyhairPage } from './app.po';

describe('ng-ohmyhair App', () => {
  let page: NgOhmyhairPage;

  beforeEach(() => {
    page = new NgOhmyhairPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
