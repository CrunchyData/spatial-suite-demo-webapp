# Contributing

Contributors should fork this repo.  Changes should be made in feature branches in their own repo.  A feature is then submitted to this repo via creating a GitHub Pull Request (PR).  The Pull Request can then be merged by the contributor or another developer with commit access.

## Git Workflow

### Create personal fork, local repo, and remotes

1. Fork on GitHub (for example, into account `my-gh`)
1. On local machine...
1. `cd <proj-dir>`
1. `git clone git@github.com:my-gh/spatial-suite-demo-webapp.git`
1. `cd spatial-suite-demo-webapp`
1. Add CrunchyData repo as remote `upstream` using `git remote add upstream git@github.com:CrunchyData/spatial-suite-demo-webapp.git`
1. Check remotes: `git remote -v`
1. Synch with upstream: `git pull upstream master`

### Work with a Feature Branch

1. Start on master branch: `git checkout master` (confirm with `git status`)
1. Synch with upstream: `git pull upstream master`
1. Create feature branch: `git checkout -b new-feature`
1. Make changes
1. Review changes with `git status`
1. Stage changes: `git add -A` or `git add ...`
1. Commit changes: `git commit -m 'msg about new feature'`
1. Push to fork repo: `git push`


