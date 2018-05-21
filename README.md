# Peril Staging Settings

🔧 Settings for Loadsmart's hosted Danger **Staging** instance

## Start Hacking

This settings repository is a way to test new rules without stable repositories in Danger.

So it is recommended to test the rules created here into the [peril-hack repo](https://github.com/loadsmart/peril-hack)

If you still prefer to test the rules in another repository, you can add Peril Staging App to it, in the same way we do for the Peril App: https://github.com/loadsmart/peril-settings#how-to-add-peril-to-my-repo

## Install

```bash
$ git clone git@github.com:loadsmart/peril-settings.git
$ cd peril-staging-settings
$ brew install yarn
$ yarn install
```

## Test

```bash
$ yarn jest
```
