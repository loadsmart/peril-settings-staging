[![CircleCI](https://circleci.com/gh/loadsmart/peril-settings.svg?style=svg)](https://circleci.com/gh/loadsmart/peril-settings)

# Peril Settings

🔧 Settings for Loadsmart's hosted Danger instance

## How to add Peril to my repo

Go to [org settings][org-settings], and then select _Installed Github
Apps_.

On the configuration screen for peril-loadsmart app, under _Repository
Access_ section, choose the repository you want Peril to run and then
click _Save_.

![repository list](https://help.github.com/assets/images/help/marketplace/marketplace-select-repo-field.png)

## Install

```bash
$ git clone git@github.com:loadsmart/peril-settings.git
$ cd peril-settings
$ brew intall yarn
$ yarn install
```

## Test
```bash
$ yarn jest
```

[org-settings]: https://github.com/organizations/loadsmart/settings/profile
