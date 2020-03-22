const endpointURL = "http://localhost:9000/graphql";

export async function loadJobs() {
  const response = await fetch(endpointURL, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      query: `{
            jobs {
              id
              title
              description
              company {
                name
                id
                description
              }
            }
        }`
    })
  });

  const responseBody = await response.json();
  return responseBody.data.jobs;
}

