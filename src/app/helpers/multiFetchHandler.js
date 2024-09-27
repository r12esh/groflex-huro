import toastService from "../services/toast.service";

export async function multiFetchHandler(fetchRequests) {
  try {
    // Promise.all to execute all fetch requests concurrently
    const responses = await Promise.all(
      fetchRequests.map((fetchRequest) =>
        fetchRequest.then((response) => response)
      )
    );

    // Return an array of responses
    return responses;
  } catch (error) {
    // Handle errors
    // console.error("Error executing API calls:", error);
    toastService.error(
      `Sorry, some error occured performing action on multiple items, see console.`
    );
    throw error; // Rethrow the error to indicate failure
  }
}
