<?php
	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError($conn->connect_error);
	} 
	else
	{
		$stmt = $conn->prepare("SELECT * FROM Contacts WHERE Name LIKE ? AND UserID = ?");
		$contactName = "%" . $inData["name"] . "%"; 
		$stmt->bind_param("si", $contactName, $inData["userId"]);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while ($row = $result->fetch_assoc())
		{
			if ($searchCount > 0)
			{
				$searchResults .= ",";
			}
			$searchCount++;
			// $searchResults .= '"' . $row["Name"] . '"';
			$searchResults .= '{"name" : "' . $row["Name"]. '", "phone" : "' . $row["Phone"]. '", "email" : "' . $row["Email"]. '"}';
		}
		
		if ($searchCount == 0)
		{
			returnWithError("No Records Found");
		}
		else
		{
			returnWithInfo($searchResults);
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
	
	function returnWithInfo($searchResults)
	{
        $retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson($retValue);
	}
	
?>
