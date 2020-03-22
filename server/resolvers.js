const db = require('./db');

const Query = {
    company: (_, args) => db.companies.get(args.id),
    job: (_, args) => db.jobs.get(args.id),
    jobs: () => db.jobs.list()
};

const Mutation = {
    createJob: (_, { input }, { user }) => {
        if (!user) throw new Error('Unauthorized');
        const id = db.jobs.create({ ...input, companyId: user.companyId });
        return db.jobs.get(id);
    }
}

const Company = {
    jobs: (company) => db.jobs.list().filter(job => job.companyId === company.id)
}

const Job = {
    company: (job) => db.companies.get(job.companyId)
}

module.exports = { Query, Mutation, Company, Job };