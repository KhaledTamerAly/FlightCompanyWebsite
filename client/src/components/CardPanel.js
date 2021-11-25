import React, { Component ,  useState, useEffect } from 'react';
import {Button, Card, CardBody, CardTitle, CardSubtitle, CardText} from 'reactstrap'
import DeleteButton from './AdminCRUD';
function CardPanel(props)
{
  const[isDeleted,setIsDeleted] = useState(false);

  function deleteFlight()
  {
    setIsDeleted(true);
  }
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
            {props.idOfFlight}
          </CardSubtitle>
          <CardText>
            {props.content}
          </CardText>
      <DeleteButton i = {props.i} idOfFlight = {props.idOfFlight} onDelete={props.deleteFlight} />
        </CardBody>
      </Card>
    </div>
  );
}

export default CardPanel;