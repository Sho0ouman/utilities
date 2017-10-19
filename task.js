var Task = (function () {
    return function (handler, every) {
        var _every,
            _guard,
            _intervalId,
            _timeOutId,
            _startedAt,
            _continuedAt,
            _isStarted,
            _isKilled,
            _isPaused,
            _handler;

        (function init(h, e) {
            _isStarted = false;
            _isPaused = false;
            _guard = {
                run() {
                    if (_guard.stopAfter !== undefined) {
                        _guard.id = setInterval(function () {
                            var passedTime = performance.now() - _startedAt;
                            if (passedTime >= _guard.stopAfter) {
                                stop();
                                _isKilled = true;
                                clearInterval(_guard.id);
                            }
                        }, 1);
                    }
                },
                stop() {
                    if (id !== undefined)
                        clearInterval(id);
                }
            };
            if (typeof every === 'number')
                _every = e;
            if (typeof handler === 'function')
                _handler = h;
        }(handler, every));

        function run() {
            if (!_isStarted) {
                _startedAt = performance.now();
                _guard.run();
            }
            _continuedAt = performance.now();
            _intervalId = setInterval(_handler, _every);
            _isStarted = true;
        }

        function stop() {
            if (_intervalId) {
                clearInterval(_intervalId);
                return performance.now() - _continuedAt;
            }
        }

        this.setHandler = function (handler) {
            if (_handler === undefined && typeof handler === 'function')
                _handler = handler;
        }

        this.stopAfter = function (stopAfter) {
            if (stopAfter !== undefined && typeof stopAfter === 'number')
                _guard.stopAfter = stopAfter;
            return _guard.stopAfter;
        }

        this.Every = function (every) {
            if (every !== undefined && _every === undefined && typeof every === 'number')
                _every = every;
            return _every;
        }

        this.run = function (runAfter) {
            if (!_isStarted) {
                if (runAfter)
                    _timeOutId = setTimeout(function () {
                        run();
                    }, runAfter);
                else
                    run();
            }
        }

        this.pause = function () {
            if (_isStarted && !_isPaused && !_isKilled) {
                _isPaused = true;
                return stop();
            }
        }

        this.continue = function () {
            if (_isStarted && _isPaused && !_isKilled) {
                _isPaused = false;
                run();
            }
        }

        this.rollback = function () {
            if (_timeOutId)
                clearTimeout(_timeOutId);
        }

        this.kill = function () {
            _isKilled = true;
            stop();
            return performance.now() - _startedAt;
        }
    }
}());
