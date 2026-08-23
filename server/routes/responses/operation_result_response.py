from .response_base import ResponseBase


class OperationResultResponse(ResponseBase):
    ok: bool

    error: str

    def __init__(self, ok: bool, error_message: str | None = None, exception: Exception | None = None):
        super().__init__()
        self.ok = ok

        if not ok:
            if error_message is not None:
                self.error = error_message
            elif exception is not None:
                self.error = str(exception)
            else:
                self.error = 'Unknown error occurred.'