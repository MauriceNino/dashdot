# Contributing

The simplest way of contributing is to create
[a new issue](https://github.com/MauriceNino/dashdot/issues) using the
corresponding templates for feature-requests and bug-reports.

If you are able to, you can also create a
[pull request](https://github.com/MauriceNino/dashdot/pulls) to add the wanted
features or fix the found bug yourself. Any contribution is highly appreciated!

## Setup

To start working on this project, run the following series of commands:

```bash
git clone https://github.com/MauriceNino/dashdot &&\
  cd dashdot &&\
  yarn &&\
  yarn build
```

After that, you might need to restart Visual Studio Code, because otherwise there
can be some errors with Typescript.

When you are done with all that, you can start a dev server using `docker-compose`
with:

```bash
yarn dev
```

## Git

Development is done on the `dev` branch, so please use that as the base branch in your work.

This project uses semantic commit messages - if you are unsure on how to create a semantic commit message,
you can check out the [Semantic Commit Message Standards](https://www.conventionalcommits.org/en/v1.0.0/),
or run the interactive commit message creator, which will create the commit message for you:

```bash
yarn commit
```
