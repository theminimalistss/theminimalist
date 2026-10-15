<?php

declare(strict_types=1);

use TheMinimalist\Contact\Http\Request;

$application = require dirname(__DIR__) . '/app/bootstrap.php';

$application->handle(Request::fromGlobals())->send();
