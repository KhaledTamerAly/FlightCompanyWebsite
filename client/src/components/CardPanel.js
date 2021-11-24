import React, { Component ,  useState, useEffect } from 'react';
import {Button, Card, CardBody, CardTitle, CardSubtitle, CardText} from 'reactstrap'
function CardPanel(props)
{
    return(
    <div>
      <Card>
        <CardBody>
          <CardTitle tag="h5">
            {props.title}
          </CardTitle>
          <CardSubtitle
            className="mb-2 text-muted"
            tag="h6"
          >
            {props.subtitle}
          </CardSubtitle>
          <CardText>
            {props.content}
          </CardText>
      <Button> Button</Button>
        </CardBody>
      </Card>
    </div>
  );
}

export default CardPanel;