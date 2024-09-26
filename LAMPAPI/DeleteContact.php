<?php
    $inData = getRequestInfo();

    $id = $inData["id"];
    $userId = $inData["userId"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ? AND UserID = ?");
        $stmt->bind_param('si', $id, $userId);
        $stmt->execute();
        
        if ($stmt->affected_rows > 0) {
            returnWithSuccess("Contact deleted successfully");
        } else {
            returnWithError("No contact found with the given details");
        }

        $stmt->close();
        $conn->close();
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err)
    {
        $retValue = '{"id":0, "name":"", "email":"",  "error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithSuccess($msg)
    {
        $retValue = '{"result":"' . $msg . '","error":""}';
        sendResultInfoAsJson($retValue);
    }
?>
