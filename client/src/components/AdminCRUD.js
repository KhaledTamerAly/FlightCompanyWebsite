import React, {useState} from 'react';
import axios from 'axios';
import { Button,UncontrolledPopover,PopoverBody,PopoverHeader } from 'reactstrap';

function DeleteButton(props)
{
    function deleteFlight(props)
    {
        var url = '/flights/' + props.id;
        axios
            .delete(url)
            .then(()=> console.log("deleted..."));
        props.onDelete();
    }

    if(props.remove)
        return;
    return (
    <div className="text-center">
    <Button
            id="UncontrolledPopover"
            type="button"
            color="danger"
    >
        Delete
    </Button>
    <UncontrolledPopover
            placement="right"
            target="UncontrolledPopover"
            trigger="legacy"
    >
        <PopoverHeader>
            Are you sure?
        </PopoverHeader>
        <PopoverBody>
            This action cannot be undone. 
            It will be deleted forever.
            &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
            Click outside this popup to return.
        </PopoverBody>
            <div className="text-center">
            <Button
                id="deleteConfirm"
                type="button"
                color="danger"
                onClick = {()=>deleteFlight(props)}
            >
            Delete, I am sure.
            </Button>
            </div>
    </UncontrolledPopover>    
    </div>
    );
}
export default DeleteButton;