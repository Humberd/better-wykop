import { AppStorage } from '../../utils/app-storage';
import { CommentsHiderModuleState } from './module-state';
import { isElementInViewport, lazyLoadImages, scrollTo, scrollToTop } from '../../utils/utils';
import { getEntries } from '../../utils/queries';
import { AppModule } from '../app-module';
import { AppEvents, OnItemsLoadedPayload } from '../../services/events';
import './styles.scss';
import { StatePersistor } from '../../utils/state-persistor';
import { getCommentId } from '../../utils/extractors';
import { Service } from 'typedi';
import { AppState } from '../../services/app-state';

@Service()
export class CommentsHiderModule extends AppModule {

  static readonly MODULE_NAME = 'CommentsHiderModule';

  private readonly statePersistor = new StatePersistor<CommentsHiderModuleState>(new AppStorage(CommentsHiderModule.MODULE_NAME));

  constructor(private appEvents: AppEvents,
              private appState: AppState) {
    super();

  }

  async init() {
    await this.statePersistor.initState({commentHidePersistor: {}});

    this.listenForEvents();
  }


  private listenForEvents() {
    this.appEvents.onItemsLoaded
        .asObservable()
        .subscribe(payload => this.addCommentButtons(payload.data));
  }

  private addCommentButtons(entries: NodeListOf<Element>) {

    let appliedCounter = 0;

    for (const commentBlock of entries) {

      const aElem = this.createHideButton(commentBlock);

      const commentId = getCommentId(commentBlock);

      if (this.isCommentHidden(this.appState.articleId, commentId)) {
        this.hideComments(aElem, commentBlock, this.appState.articleId, commentId);
      } else {
        this.showComments(aElem, commentBlock, this.appState.articleId, commentId);
      }

      aElem.addEventListener('click', () => {
        if (this.isCommentHidden(this.appState.articleId, commentId)) {
          this.showComments(aElem, commentBlock, this.appState.articleId, commentId);
        } else {
          this.hideComments(aElem, commentBlock, this.appState.articleId, commentId);
          this.appEvents.onCommentHid.next();
          if (!isElementInViewport(commentBlock)) {
            scrollTo(commentBlock);
          }
          lazyLoadImages();
        }
      });

      appliedCounter++;
    }

    console.log(`Added ${appliedCounter}/${entries.length} comments hide buttons`);

    lazyLoadImages();

  }

  private createHideButton(parent: Element): Element {
    const a = document.createElement('a');
    a.setAttribute('href', 'javascript:void(0)');
    a.classList.add('comment-expand');

    parent.prepend(a);

    return a;
  }

  private hideComments(aElem: Element, parent: Element, articleId: string, commentId: string) {
    aElem.textContent = '[+]';
    parent.classList.add('collapsed');
    this.statePersistor.state.commentHidePersistor[articleId] = this.statePersistor.state.commentHidePersistor[articleId] ||
        {collapsedThings: {}};
    this.statePersistor.state.commentHidePersistor[articleId].lastUpdate = new Date().getTime();
    this.statePersistor.state.commentHidePersistor[articleId].collapsedThings[commentId] = true;
    this.statePersistor.save();
  }

  private showComments(aElem: Element, parent: Element, articleId: string, commentId: string) {
    aElem.textContent = '[-]';
    parent.classList.remove('collapsed');
    this.statePersistor.state.commentHidePersistor[articleId] = this.statePersistor.state.commentHidePersistor[articleId] ||
        {collapsedThings: {}};
    this.statePersistor.state.commentHidePersistor[articleId].lastUpdate = new Date().getTime();
    delete this.statePersistor.state.commentHidePersistor[articleId].collapsedThings[commentId];
    this.statePersistor.save();
  }

  private isCommentHidden(articleId: string, commentId: string): boolean {
    return this.statePersistor.state.commentHidePersistor[articleId] &&
        this.statePersistor.state.commentHidePersistor[articleId].collapsedThings &&
        this.statePersistor.state.commentHidePersistor[articleId].collapsedThings[commentId];
  }

}
