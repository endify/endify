import {EndifyCoreHooks} from '../EndifyCoreService/enum/EndifyCoreHooks'
import {SyncHook, SyncWaterfallHook} from 'tapable'
import {IHookService} from '../HookService/types/IHookService'
import {MultiBar, Presets, SingleBar} from 'cli-progress'
import * as chalk from 'chalk'

interface ProgressEntity {
  percentage: number,
  message: string,
  name: string,
  title?: string
}

interface BarEntity {
  bar: SingleBar,
  progressEntity: ProgressEntity
}


export class CliProgressService {
  private bar: MultiBar
  private barEntities: BarEntity[] = []
  private updateSymbol: symbol

  constructor() {
    this.bar = new MultiBar({
      format: `${chalk.bold('{title}')} {bar} {percentage}% ${chalk.gray('·')} {value}/{total} ${chalk.gray('·')} {message}`,
      barCompleteChar: '-',
      barIncompleteChar: ' ',
      formatBar: this.formatBar.bind(this),
      clearOnComplete: false,
      hideCursor: true,
      barsize: 20,
      fps: 120,
    }, Presets.shades_grey)
  }

  // setup() {
  //   const emitBuildProgressChangeHook = this.hooks.registerHook(EndifyCoreHooks.EMIT_BUILD_PROGRESS_CHANGE, new SyncHook())
  //   const buildProgressChangeHook = this.hooks.registerHook<SyncWaterfallHook<[ProgressEntity[]]>>(EndifyCoreHooks.BUILD_PROGRESS_CHANGE, new SyncWaterfallHook(['progressEntities']))
  //   emitBuildProgressChangeHook.tap('Show progress', () => {
  //     const progressEntities = buildProgressChangeHook.call([])
  //     this.updateBarState(progressEntities)
  //   })
  // }

  removeBars() {
    for(const {bar} of this.barEntities) {
      this.bar.remove(bar)
    }
    this.barEntities = []
  }

  updateBarState(progressEntities: ProgressEntity[]) {
    // console.log('update state', progressEntities[0])
    for(const progressEntity of progressEntities) {
      const existingBarEntity = this.barEntities.find(barEntity => barEntity.progressEntity.name === progressEntity.name)
      const barPayload = this.getBarPayload(progressEntity)
      const percentage = this.calculatePercentage(progressEntity.percentage)
      if(existingBarEntity) {
        existingBarEntity.progressEntity = progressEntity
      } else /*if(percentage < 1)*/ {
        const bar = this.bar.create(100, percentage, barPayload)
        this.barEntities.push({
          progressEntity,
          bar,
        })
        bar.start()
      }
    }

    for(const {progressEntity, bar} of this.barEntities) {
      const barPayload = this.getBarPayload(progressEntity)
      const percentage = this.calculatePercentage(progressEntity.percentage)
      bar.update(percentage, barPayload)
    }

    // const allBarsHaveFinished = progressEntities.every(progressEntity => progressEntity.percentage >= 1)
    // if(allBarsHaveFinished) {
    //   for(const {bar} of this.barEntities) {
    //     this.bar.remove(bar)
    //   }
    //   this.barEntities = []
    // }

    // const updateSymbol = Symbol()
    // this.updateSymbol = updateSymbol
    // setTimeout(() => {
    //   if(this.updateSymbol !== updateSymbol) {
    //     return
    //   }
    //   this.updateBarState(progressEntities)
    // }, 1000)
  }

  getBarPayload(progressEntity: ProgressEntity) {
    let message = progressEntity.percentage < 1 ? progressEntity.message : chalk.bgRed.black(' ✔ READY ')
    if(Array.isArray(message)) {
      message = message.join(chalk.gray(' · '))
    }
    return {
      title: progressEntity.title || progressEntity.name,
      message,
    }
  }

  calculatePercentage(percentage: number): number {
    return Math.min(Math.floor(percentage * 100), 100)
  }
  
  formatBar(progress, options){
    const completeSize = Math.round(progress * options.barsize)
    const incompleteSize = options.barsize - completeSize
    return  [
      chalk.red('['),
      options.barCompleteString.substr(0, completeSize),
      options.barGlue,
      options.barIncompleteString.substr(0, incompleteSize),
      chalk.red(']'),
    ].join('')
  }
}
