const db = require('./db');

const Query = {
    company: (_, args) => db.companies.get(args.id),
    job: (_, args) => db.jobs.get(args.id),
    jobs: () => db.jobs.list()
};

const Job = {
    company: (job) => db.companies.get(job.companyId)
}

module.exports = { Query, Job };