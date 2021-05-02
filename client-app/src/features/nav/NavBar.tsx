import React from "react";
import { Button, Container, Menu } from "semantic-ui-react";

interface IProbs{
    openCreateForm:()=>void;
}

export const NavBar:React.FC<IProbs> = ({openCreateForm}) => {
  return (
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item header>
            <img src="/assets/logo.png" alt="" style={{marginRight:'10px'}}/>
            Reactivities
        </Menu.Item>
        <Menu.Item name="Activities" />
        <Menu.Item>
            <Button onClick={openCreateForm} positive content="Crerate Activity"/>
        </Menu.Item>
      </Container>
    </Menu>
  );
};
