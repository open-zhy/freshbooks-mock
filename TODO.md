# TODO list
===========

In order to reach a 1.x version there is still some endpoints and behaviors to complete

> Database: lowdb provides a limited support of what we expect, in order to support node cluster it should be possible to share same instance of database overall workers
> Endpoints: so far we focused only on most used endpoints in client, invoice and payment. The next milestone should focus on covering resources listed in official documentation [https://www.freshbooks.com/classic-api/docs](https://www.freshbooks.com/classic-api/docs), expect ones that doesn't really need mock
> Implement Unit tests
> `<resource>.list` so far are not complete, all filtering that can be performed with realt freshbooks API should be implemented as well
> Documentation: provide full set of documentation, about the usage of this application, its scope. started in readme.md (not yes completed)
> Any improvement is much appreciated