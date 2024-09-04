<?php
	// Copy of search, adjust as needed before using in repo
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
		// Prepare statement to search for partial matches in the Name column of Contacts
		$stmt = $conn->prepare("SELECT * FROM Contacts WHERE Name LIKE ? AND UserID = ?");
		$contactName = "%" . $inData["name"] . "%"; // Use "name" to match the Postman input
		$stmt->bind_param("si", $contactName, $inData["userId"]);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		// Fetch results and construct a JSON response
		while ($row = $result->fetch_assoc())
		{
			if ($searchCount > 0)
			{
				$searchResults .= ",";
			}
			$searchCount++;
			// $searchResults .= '"' . $row["Name"] . '"';
			$searchResults .= '{"Full Name" : "' . $row["Name"]. '", "Phone Number" : "' . $row["Phone"]. '", "Email" : "' . $row["Email"]. '"}';
		}
		
		// Handle case where no records were found
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

	// Function to get JSON request info
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	// Function to send result info as JSON
	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	// Function to handle errors
	function returnWithError($err)
	{
		$retValue = '{"results":,"error":"' . $err . '"}'; 
		sendResultInfoAsJson($retValue);
	}
	
	// Function to return successful search results
	function returnWithInfo($searchResults)
	{
		$retValue = '{"results":' . $searchResults . ',"error":""}';
		sendResultInfoAsJson($retValue);
	}
	
?>
