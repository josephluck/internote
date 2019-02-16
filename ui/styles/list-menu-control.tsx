import * as React from "react";
import { Collapse } from "react-collapse";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { DropdownMenuItem, DropdownMenuSpacer } from "./dropdown-menu";

interface RenderProps {
  toMainMenu: () => void;
  toSubMenu: (subMenu: string) => void;
}

interface MenuItem {
  title?: string;
  subMenu?: (menu: RenderProps) => React.ReactNode;
  item: (menu: RenderProps) => React.ReactNode;
  spacerAfter?: boolean;
}

interface Props {
  items: MenuItem[];
  menuOnRight?: boolean;
  onClose?: () => any;
}

interface State {
  subMenu: null | string; // todo, infer this from props
}

export class ListMenuControl extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      subMenu: null
    };
  }

  show = (subMenu: null | string) => {
    this.setState({ subMenu });
  };

  back = () => {
    this.setState({ subMenu: null });
  };

  render() {
    const renderProps: RenderProps = {
      toSubMenu: this.show,
      toMainMenu: this.back
    };
    const subMenu = this.state.subMenu
      ? this.props.items.find(item => item.title === this.state.subMenu)
      : null;
    return (
      <Collapse isOpened>
        {subMenu && subMenu.subMenu ? (
          <>
            <DropdownMenuItem
              onClick={this.back}
              icon={<FontAwesomeIcon icon={faChevronLeft} />}
            >
              {subMenu.title}
            </DropdownMenuItem>
            <DropdownMenuSpacer />
            {subMenu.subMenu(renderProps)}
          </>
        ) : (
          <div>
            {this.props.items.map((item, i) => (
              <div key={item.title || i}>
                {item.item(renderProps)}
                {item.spacerAfter ? <DropdownMenuSpacer /> : null}
              </div>
            ))}
          </div>
        )}
      </Collapse>
    );
  }
}
