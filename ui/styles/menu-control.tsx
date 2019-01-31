import * as React from 'react'
import { OnClickOutside } from './on-click-outside'
import styled from 'styled-components'

const MenuWrapper = styled(OnClickOutside)`
  position: relative;
`

export type ChildProps = {
  toggleMenuShowing: (menuShowing: boolean) => void
} & State

interface Props {
  children: (state: ChildProps) => React.ReactNode
  menu: (state: ChildProps) => React.ReactNode
  className?: string
  onClose?: () => any
}

interface State {
  menuShowing: boolean
}

export class MenuControl extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      menuShowing: false,
    }
  }

  toggleMenuShowing = (menuShowing: boolean) => {
    this.setState({ menuShowing })
  }

  render() {
    const { className = '', children, menu } = this.props
    const childProps = {
      ...this.state,
      toggleMenuShowing: this.toggleMenuShowing,
    }
    return (
      <MenuWrapper
        className={className}
        onClickOutside={() => {
          this.toggleMenuShowing(false)
          if (this.props.onClose) {
            this.props.onClose()
          }
        }}
      >
        {menu(childProps)}
        {children(childProps)}
      </MenuWrapper>
    )
  }
}