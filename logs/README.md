# Logger settings

You can cofigure logs level and maximum log files size treshold in KB. When the size of the current file exceeds this threshold, a new file will be created. `Attention:` New files are created every time the application starts. `LOG_MAX_SIZE_TRESHOLD_KB` default value is 10.

| LOG_LEVEL | collected log                              |
|-----------|--------------------------------------------|
| 0         | `none`                                     |
| 1         | `error`                                    |
| 2         | `error`, `log`                             |
| 3         | `error`, `log`, `warn`                     |
| 4         | `error`, `log`, `warn`, `debug`            |
| 5         | `error`, `log`, `warn`, `debug`, `verbose` |

Default `LOG_LEVEL` value is 2.

You must place these settings in a `.env` file at the root of the project. If these settings are not present in the `.env` file or have invalid values, the default values will be used.
