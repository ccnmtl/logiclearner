# Logic Learner
[![Actions Status](https://github.com/ccnmtl/logiclearner/workflows/build-and-test/badge.svg)](https://github.com/ccnmtl/logiclearner/actions)

Logic Learner is an online learning tool that helps computer science, engineering, and mathematics students improve their fluency and problem solving process in writing proofs for propositional logic.

## Configuration

1. Clone

    git clone https://github.com/ccnmtl/logiclearner.git
    
    cd logiclearner

2. Create the database

   For Postgres:
     * Create a database user/password (if needed)
     * Create the database `createdb logiclearner`

3. Customize settings

    * Create a local_settings.py file in the `logiclearner` subdirectory OR
    * Copy `logiclearner/settings_shared.py` to `logiclearner/local_settings.py`
    * Then, override the variables from `settings_shared.py` that you need to customize for your local installation.
      * Customize your `DATABASES` dictionary
        * e.g. set NAME, HOST, USER, and PASSWORD. remove PORT (unless it's non-standard)

4. Build the virtual environment

   `make` will build the virtualenv

5. Migrate the database

   `./manage.py migrate`

6. Run
    
    Use `make dev` This is equivalent to running Django's ./manage.py runserver in one shell and Webpack in another. The output from both will be printed to the shell. Use CTR-C to exit.
    
    To test, use `make all` This is what Travis and Jenkins runs to build the project.
