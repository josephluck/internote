import * as React from 'react'
import * as ReactDOM from 'react-dom'

interface Props {
  children: React.ReactNode
  onClickOutside?: (e: MouseEvent) => any
  disabled?: boolean
  className?: string
}

/**
 * A component that exposes a callback when a click
 * occurs outside it.
 *
 * NB: if this is used on elements that are shown as a
 * result of a click event (i.e. modal, bottom-sheet, tray)
 * then the click event's propagation needs to be stopped
 * via event.stopPropagation() to avoid this component's
 * onClickOutside callback being immediately called
 * (resulting in immediately dismissing the modal).
 */
export class OnClickOutside extends React.Component<Props, {}> {
  wrappingElm: null | HTMLDivElement = null

  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    if (this.props.onClickOutside) {
      window.addEventListener('click', this.onClick)
    }
  }

  componentWillUnmount() {
    if (this.props.onClickOutside) {
      window.removeEventListener('click', this.onClick)
    }
  }

  onClick = (e: MouseEvent) => {
    // NB: clickedElementStillExists is required because when clicking
    //     an element inside a component wrapped inside OnClickOutside
    //     that gets unmounted when clicked, this method will fire and
    //     the condition for closure will fire.
    //
    //     A example of this is PaymentModal in Stream where there are
    //     buttons in the footer that switch the tab which unmount
    //     when they are clicked. onClick  will fire AFTER the button
    //     has unmounted from the dom, so the check below will be
    //     incorrect.

    const clickedElementStillExists = document.body.contains(
      e.target as HTMLElement,
    )

    if (
      this.wrappingElm &&
      this.props.disabled !== true &&
      clickedElementStillExists
    ) {
      if (
        !this.wrappingElm.contains(e.target as HTMLElement) &&
        this.props.onClickOutside
      ) {
        this.props.onClickOutside(e)
      }
    }
  }

  render() {
    return (
      <div
        ref={elm => {
          if (elm) {
            this.wrappingElm = ReactDOM.findDOMNode(elm) as any
          }
        }}
        className={this.props.className || ''}
      >
        {this.props.children}
      </div>
    )
  }
}