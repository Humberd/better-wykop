import { AppModule } from './modules/app-module';
import { CommentsHiderModule } from './modules/comments-hider/comments-hider.module';
import { AppEvents } from './events';
import { ChildrenCounterModule } from './modules/children-counter/children-counter.module';
import { FooterRemoverModule } from './modules/footer-remover/footer-remover.module';
import { InfiniteScrollModule } from './modules/infinite-scroll/infinite-scroll.module';
import { AdsHiderModule } from './modules/ads-hider/ads-hider.module';

type AppModuleChild = new (appEvents: AppEvents) => AppModule;

(async function () {
  const appEvents = new AppEvents();

  await loadModules(appEvents, [
    CommentsHiderModule,
    ChildrenCounterModule,
    FooterRemoverModule,
    InfiniteScrollModule,
    AdsHiderModule,
  ]);

  await initEvents(appEvents);
})();

async function loadModules(appEvents: AppEvents, modules: AppModuleChild[]) {

  let successCounter = 0;

  for (const module of modules) {

    try {
      await loadModule(module, appEvents);
      successCounter++;
      console.log(`Module ${(module as any).MODULE_NAME}: OK`);
    } catch (e) {
      console.error(`Module ${(module as any).MODULE_NAME}: initialization FAILED`, e);
    }

  }

  console.log(`--- Loaded ${successCounter}/${modules.length} modules ---`);
}

async function loadModule(module: AppModuleChild, appEvents: AppEvents) {
  return new module(appEvents).init();
}

async function initEvents(appEvents: AppEvents) {
  appEvents.onItemsLoaded.next({isInitial: true});
}
