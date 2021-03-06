import { getAllItems, getAllItemsParent, getPager } from '../../queries';
import { isElementInViewport } from '../../utils';
import { PageController, PageInfo } from './page-controller';
import { AppModule } from '../app-module';
import { AppEvents } from '../../events';
import './styles.scss';

export class InfiniteScrollModule extends AppModule {

  static readonly MODULE_NAME = 'InfiniteScrollModule';

  private pageController: PageController;

  constructor(private appEvents: AppEvents) {
    super();
  }

  async init() {
    const pageInfo = this.getPageInfo();

    this.pageController = new PageController(
        pageInfo.basePath,
        pageInfo.currentPage,
    );

    this.addLoaderAnimationAbovePager();
    this.startOnScrollListener();
  }

  private getPageInfo(): PageInfo {
    const pathname = location.pathname;

    const regex = /^(.*)\/strona\/(\d+).*$/;
    const result = regex.exec(pathname);
    if (!result) {
      return {basePath: pathname, currentPage: 1};
    }

    return {basePath: result[1] || '/', currentPage: Number(result[2])};
  }

  private startOnScrollListener() {
    const elemTriggeringNextPage = getPager();

    if (this.pageController.page.isLast) {
      console.log('The first page is also the last. Infinite scoll is disabled.');
      return;
    }

    const scrollHandler = async () => {
      if (!this.pageController.page.isLoading && isElementInViewport(elemTriggeringNextPage)) {
        const previousPageLastItem = this.getLastItem();

        await this.pageController.loadNextPage();

        this.addPageBar(previousPageLastItem, this.pageController.page.currentPage);
        this.appEvents.onItemsLoaded.next({isInitial: false});

        if (this.pageController.page.isLast) {
          console.log(`Page ${this.pageController.page.currentPage} is the last one. Infinite scroll is disabled`);
          window.removeEventListener('scroll', scrollHandler);
        }
      }
    };

    window.addEventListener('scroll', scrollHandler);

    this.appEvents.onCommentHid
        .asObservable()
        .subscribe(scrollHandler);

  }

  private getLastItem(): Element {
    const items = getAllItems();
    return items[items.length - 1];
  }

  private addPageBar(lastItem: Element, pageNumber: number) {
    const elem = document.createElement('li');
    elem.classList.add('next-page-bar');
    elem.textContent = `Strona ${pageNumber}`;

    getAllItemsParent().insertBefore(elem, lastItem.nextSibling);
  }

  private addLoaderAnimationAbovePager(): void {
    const loaderWrapper = document.createElement('div');
    loaderWrapper.classList.add('__loader-wrapper');

    const loader = document.createElement('div');
    loader.classList.add('__loader');

    loaderWrapper.appendChild(loader);

    const contentElem = document.querySelector('#content');
    const pagerElem = document.querySelector('.pager');
    contentElem?.insertBefore(loaderWrapper, pagerElem);
  }

}
