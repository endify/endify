import {CliHooks} from '../../../enum/CliHooks'
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
  private hooks: IHookService
  private bar: MultiBar
  private barEntities: BarEntity[] = []

  constructor(hooks) {
    this.hooks = hooks
    this.bar = new MultiBar({
      format: `${chalk.bold('{title}')} {bar} {percentage}% ${chalk.gray('·')} {message}`,
      barCompleteChar: '-',
      barIncompleteChar: ' ',
      formatBar: this.formatBar.bind(this),
      clearOnComplete: false,
      hideCursor: true,
      barsize: 20,
    }, Presets.shades_grey)
  }

  setup() {
    const emitBuildProgressChangeHook = this.hooks.registerHook(CliHooks.EMIT_BUILD_PROGRESS_CHANGE, new SyncHook())
    const buildProgressChangeHook = this.hooks.registerHook<SyncWaterfallHook<[ProgressEntity[]]>>(CliHooks.BUILD_PROGRESS_CHANGE, new SyncWaterfallHook(['progressEntities']))
    emitBuildProgressChangeHook.tap('Show progress', () => {
      const progressEntities = buildProgressChangeHook.call([])
      this.updateBarState(progressEntities)
    })
  }

  updateBarState(progressEntities: ProgressEntity[]) {
    //add new bar entities
    for(const progressEntity of progressEntities) {
      const existingBarEntity = this.barEntities.find(barEntity => barEntity.progressEntity.name === progressEntity.name)
      const barPayload = this.getBarPayload(progressEntity)
      const percentage = this.calculatePercentage(progressEntity.percentage)
      if(existingBarEntity) {
        existingBarEntity.progressEntity = progressEntity
      } else if(percentage < 1) {
        const bar = this.bar.create(100, percentage, barPayload)
        this.barEntities.push({
          progressEntity,
          bar,
        })
        bar.start()
      }
    }
    const allBarsHaveFinished = progressEntities.every(progressEntity => progressEntity.percentage >= 1)
    if(allBarsHaveFinished) {
      for(const {bar} of this.barEntities) {
        this.bar.remove(bar)
      }
      this.barEntities = []
    } else {
      for(const {progressEntity, bar} of this.barEntities) {
        const barPayload = this.getBarPayload(progressEntity)
        const percentage = this.calculatePercentage(progressEntity.percentage)
        bar.update(percentage, barPayload)
      }
    }
  }

  getBarPayload(progressEntity: ProgressEntity) {
    return {
      title: progressEntity.title || progressEntity.name,
      message: progressEntity.message || chalk.bgRed.black(' ✔ READY '),
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
