import { Lightning } from '@lightningjs/sdk'

export default class Button extends Lightning.Component {
  static _template() {
    return {
      h: 50,
      w: 200,
      rect: true,
      Label: {
        x: (w) => w / 2,
        y: (h) => h / 2,
        mount: 0.5,
        color: 0xff000000,
        text: { fontSize: 32 },
      },
    }
  }

  set label(value) {
    this.tag('Label').text = value.toString()
  }

  _focus() {
    this.patch({
      smooth: { color: 0xff763ffc },
      Label: {
        smooth: { color: 0xffffffff },
      },
    })
  }

  _unfocus() {
    this.patch({
      smooth: { color: 0xffffffff },
      Label: {
        smooth: { color: 0xff000000 },
      },
    })
  }
}
