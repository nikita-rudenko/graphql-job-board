import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from "apollo-boost";
import gql from 'graphql-tag';
import { isLoggedIn, getAccessToken } from "./auth";

const endpointURL = "http://localhost:9000/graphql";

const authLink = new ApolloLink((operation, forward) => {
  if (isLoggedIn()) {
    operation.setContext({
      headers: {
        'authorization': `Bearer ${getAccessToken()}`
      }
    })
  }

  return forward(operation);
})

const client = new ApolloClient({
  link: ApolloLink.from([
    authLink,
    new HttpLink({ uri: endpointURL })
  ]),
  cache: new InMemoryCache()
});

const jobDetailFragment = gql`
  fragment JobDetail on Job {
    id
    title
    description
    company {
      name
      id
    }
  }
`;

const createJobMutation = gql`
  mutation CreateJob($input: CreateJobInput) {
    job: createJob(input: $input) {
      ...JobDetail
    }
    ${jobDetailFragment}
  }
`;

const companyQuery = gql`
  query CompanyQuery($id: ID!) {
    company(id: $id) {
      id
      description
      name
      jobs {
        id
        title
      }
    }
  }
`;

const JobQuery = gql`
  query JobQuery($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;

const jobsQuery = gql`{
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
}`;

export async function loadJob(id) {
  const { data: { job } } = await client.query({ query: JobQuery, variables: { id } });
  return job;
}

export async function loadJobs() {
  const { data: { jobs } } = await client.query({ query: jobsQuery, fetchPolicy: 'no-cache' });
  return jobs;
}

export async function loadCompany(id) {
  const { data: { company } } = await client.query({ query: companyQuery, variables: { id } });
  return company;
}

export async function createJob(input) {
  const { data: { job } } = await client.mutate({
    mutation: createJobMutation,
    variables: { input },
    update: (cache, mutationResult) => {
      cache.writeQuery({
        query: JobQuery,
        variables: { id: mutationResult.data.job.id },
        data: mutationResult.data
      })
    } 
  });
  return job;
}
