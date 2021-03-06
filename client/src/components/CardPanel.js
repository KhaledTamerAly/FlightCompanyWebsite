import React, { Component ,  useState, useEffect } from 'react';
import {Button, Card, CardBody, CardTitle, CardSubtitle, CardText} from 'reactstrap'
import DeleteButton from './AdminCRUD';
import {useNavigate} from 'react-router-dom';
function CardPanel(props)
{
  const[isDeleted,setIsDeleted] = useState(false);

  const navigate=useNavigate();
    function goToUpdateFlight(){
        navigate('/editFlight', { state:{isAdd:false,id:props.idOfFlight}, replace:false })
    }

  function deleteFlight()
  {
    setIsDeleted(true);
  }
    return(
    <div>
      <Card>
        <CardBody style={{backgroundColor:"linen"}}>
          <CardTitle tag="h5">
            {props.title}
          </CardTitle>
          <CardSubtitle
            className="mb-2 text-muted"
            tag="h6"
          >
          </CardSubtitle>
          <CardText>
            {props.content}
          </CardText>
          <div style={{margin:"10px -100px 10px 10px"}}>
      <Button color="primary" type="button" onClick={goToUpdateFlight}> Update </Button>
      </div>
      <div style={{margin:"-48px 100px 10px 10px"}}>
      <DeleteButton i = {props.i} idOfFlight = {props.idOfFlight} onDelete={props.deleteFlight} />
      </div >
        </CardBody>
      </Card>
    </div>
  );
}

export default CardPanel;