<?php
    $inData = getRequestInfo();

    $Login = $inData->login;
    $Password = $inData->password;
    $FirstName = $inData->firstName;
    $LastName = $inData->lastName;

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $stmt1 = $conn->prepare("SELECT EXISTS(SELECT 1 FROM Users WHERE Login = ?) AS item_exists");
        $stmt1->bind_param("s",$Login);
        $stmt1->execute();
        $stmt1->bind_result($item_exists);
        $stmt1->fetch();
        $stmt1->close();
        if($item_exists)
        {
            returnWithError("Login already exists");
        }
        else
        {
            $stmt2 = $conn->prepare("insert into Users (Login, Password, FirstName, LastName) values (?, ?, ?, ?)");
            $stmt2->bind_param('ssss', $Login, $Password, $FirstName, $LastName);
            $stmt2->execute();
            $stmt2->close();
            returnWithError("");
        }
        $conn->close();
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'));
    }

	function sendResultInfoAsJson( $obj )
    {
        header('Content-type: application/json');
        echo $obj;
    }

	function returnWithError( $err )
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }
?>