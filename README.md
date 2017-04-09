# mediping
A modern alternative to smokeping

# Requirements
 - PHP (7 preferred)
 - A webserver
 - Cron

# Installation
 - Change to your target directory (ex. /var/www not /var/www/html)
 - Clone the latest version of mediping
   - by executing `git clone https://github.com/Scrumplex/mediping`
   - or by executing `wget https://github.com/Scrumplex/mediping/archive/master.zip` and unzip
 - Change to the created folder
 - Customize the configuration of mediping as you like (`config.inc.php`)
 - As a last step you should install the cron script:
   - `crontab -e`
   - go to the last line
   - append the following line:
     - `*/1 * * * * /usr/bin/php /path/to/your/installation/cron.php`

# License
This project is licensed under the Apache License 2.0. You can find more information about it in the LICENSE file.