module.exports = {

	/**
	 * INTERNAL: Get the available feedbacks.
	 *
	 * @returns {Object[]} the available feedbacks
	 * @access protected
	 * @since 1.0.0
	 */
	getPresets() {
		var self    = this
		var presets = [

			{
				category:  'Transport',
				label:     'Play',
				bank:      {
					style:        'png',
					text:         '',
					png64:        "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAQAAAAm93DmAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAHdElNRQfkAQUNESwiZvYWAAABr0lEQVRIx+3VMWgTURzH8e81cZA06iAujZCh4Kqgg0WhCEIRBxcHCYgEi4pTTQURBLt1EKpDEZxcJKBQHDoJIkrBIViELg4iSCiUdPBQXET9OiSmNrk0lzvH/N72eHz4vYN7fxhmmIETdG7Y/0gCcJQzjPGa1SRkF2jgHUMb1p1zTJorDThqzacedsGG7yyZS4WKe3zvfTHjpMuGLjnhSGKyBT5otcpbds0N5y0m7NkBIhadd8M1y+YToP+C/CUDJ1wydNlJMwOi20G20JwlV2244PhAZDfI1uULzrnuB6+5LzYZBW5Dj1k19IWnzUaRI3E/RftvqVFmmr1UucmuFA07eh7wkeseStGwS+6RbAJjN2epMM49PqUA29xRKkxR4wKv+JkQbGMFprnMV25TJYSohy0G2OJynKNCgScs8rG5FfVOZmNhAceZ5RQrzLDCr95cH7DFFbnKJTa5wTO+7YTFuXKe88ywn8c85HM/bCdQIMNJZjnBS67wtlm3/3SJAn/zgwJHuEiJOtd5zvc43XpWM/CWX9y07t3Bh1T0GM0xxUHeJBmj/33QDzNMgvwB/1oU2ZEH4vEAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjAtMDEtMDNUMDc6MjA6MDYrMDA6MDC0edj7AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIwLTAxLTAzVDA3OjIwOjA2KzAwOjAwxSRgRwAAAABJRU5ErkJggg==",
					pngalignment: 'center:center',
					size:         '18',
					color:        '16777215',
					bgcolor:      '13056',
				},
				actions:   [
					{
						action: 'play',
					}
				],
				feedbacks: [
					{
						type:    'playStatus',
						options: self.getFeedbackDefaults('playStatus')
					}
				]
			},
			{
				category:  'Transport',
				label:     'Stop',
				bank:      {
					style:        'png',
					text:         '',
					png64:        "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAQAAAAm93DmAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAHdElNRQfkAQUNES+7b6esAAAAwElEQVRIx+2VLQ4CQQxG32xWoBBwgT0ADo0CwQU4CJfAkuDhBByGC+AQGBKyoFZQDFkzP50Nm4DoG9d8/abTZFowjN/j/JB8le5FPnYjxriEt+PBFfENyqB8xoZKKa5my4FXToUDjlTsaUINaWVLJiw4xyWtUoZykp2gnJXcZOr3pIj66gQ1ZSoj9eIYBT1jhmZohjkk/3KX2a1VqI65mCZUYcOFOWt1wNbcM24R6LQCXJahvqTgGV5Sva9Rw/gH3suOQLMkWE8gAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTAxLTAzVDA3OjIwOjExKzAwOjAwvXTm6wAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0wMS0wM1QwNzoyMDoxMSswMDowMMwpXlcAAAAASUVORK5CYII=",
					pngalignment: 'center:center',
					size:         '18',
					color:        '16777215',
					bgcolor:      '1907997',
				},
				actions:   [
					{
						action: 'stop',
					}
				],
				feedbacks: [
					{
						type:    'stopStatus',
						options: self.getFeedbackDefaults('stopStatus')
					}
				]
			},
			{
				category:  'Transport',
				label:     'Record',
				bank:      {
					style:        'png',
					text:         '',
					png64:        "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAQAAAAm93DmAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAHdElNRQfkAQUNESQsvX4kAAABzElEQVRIx+2VzUtUURiHnzvDyFCKzICW00LoCxJsQEKiZRmBSzftWrYSgvkXWtWiZW3KlcsQWrkK04QWgiLCEIQDY61GCSRCJO1p4Tg2debOHTdu5nd357y/57zn430vdNXV2StqH2JH4bERnsLWcqYBy1GkSIE0O5RZ5Vu8MYrF9fOQRxTYpsYheYbY4x2vqSY8rROciNeds+Izx83ZY8Y+b/jENVe8fxTRGfCaH13ytvzzDTvjppMdIEXsd84lLx9jmjLv9aUbjnQGfGzlOLvAYQy66BszyYE5l30e3lQdOWXFW6H5VPB+ixR4G77J+sgHatwLpZMKDVJkmy+tdhABfGedMdJJgQVq/Gzz0rYYIJsUmOaw7RUekAqtGAbukA+t3qSL7LKfFFhmiEutmoMA5xmlzK8EwAhglT0eNMwhFbnCAskk4lPXHA69RBGzzjpvX8JaqVfsijP2NiMb9Txt9ahBJM8QJ9z0lYP/NYes0361ZKqDflO3TrrholPmG7Bz3nHWqiV7WuHiG+wIJe5SY50tDrjAKFf5zAve87uVud0vIMNNJhhjgBS7lFngEz/irDHV9deW0mSJ2D95d6f4SQWwSS1ddXXm+gMwfwJr+RCAuwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0wMS0wM1QwNzoxOTo1MyswMDowMMtWtPMAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjAtMDEtMDNUMDc6MTk6NTMrMDA6MDC6CwxPAAAAAElFTkSuQmCC",
					pngalignment: 'center:center',
					size:         '18',
					color:        '16777215',
					bgcolor:      '3866624',
				},
				actions:   [
					{
						action: 'record',
					}
				],
				feedbacks: [
					{
						type:    'recordStatus',
						options: self.getFeedbackDefaults('recordStatus')
					}
				]
			},
			{
				category:        'Transport',
				label:           'Rewind',
				bank:            {
					style:        'png',
					text:         '',
					png64:        "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAQAAAAm93DmAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAHdElNRQfkAQUNESFc14qrAAABhklEQVRIx+2UzSsEcRyHn1nvJ69XRRwpm0X26CTKRRStvSkX5eCmnBWF4qbsgbPyB7grxcFLeYmdxAU3hcN+HHZmzO6O9ZtynM/v9vT9PTN9P9NAlChR/o7194gCRvXrdctM5h9WWUHMQFfHKEl3MogZRvnTrE296VKdKmZXeWb4hs5oBzsMsUkNzUVsg1oaMBPKvTrIPi2kOSTnrW6QPVqY4ZBc0N1YkM7Z9jgZsqQ4pcLZfZ7ZpDjzmOHmarQgW2tqEEIJ3apPlQWsV3dKyFDYpHXZmle1o0/oRsNaVdbHQgirtK1rjQnv9CqrY125jDLCoFIqaOeVC3eVAFTSxovLyiVI+MESn+yT9CqyeGeZrwIWQginpLknw4TXZIwTh00atlvSc71WZGtRtU7L/UXMtBSfskpzetCWGhV3hH7WE0LIT7+jOteBpnWjAY+N6FwHmgol9EnjOtKzbHWrkD3pUV2lQqu8EoBWZnkiw4dVyJ7ZzTNj4b//YIOfF/ariRIlSmm+AVx3FmxwN3xbAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTAxLTAzVDA3OjE5OjQ5KzAwOjAwo4zrIwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0wMS0wM1QwNzoxOTo0OSswMDowMNLRU58AAAAASUVORK5CYII=",
					pngalignment: 'center:center',
					size:         '18',
					color:        '16777215',
					bgcolor:      '6245376',
				},
				actions:         [
					{
						action: 'start_rewind',
					}
				],
				release_actions: [
					{
						action: 'stop_rewind'
					}
				],
				feedbacks:       [
					{
						type:    'rewindStatus',
						options: self.getFeedbackDefaults('rewindStatus')
					}
				]
			},
			{
				category:        'Transport',
				label:           'Forward',
				bank:            {
					style:        'png',
					text:         '',
					png64:        "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAQAAAAm93DmAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAHdElNRQfkAQUNESe1tC+eAAABfUlEQVRIx+2VOyxDURyHv5ZEpTQREbQxWCweMTFYGVgMTB7xioHYGC0GcweJIPGuUbAQE0ZlFBuLSBpzFwn9Ga7e9ra3996K8f7G75zz3fM/rwt+/PhxT6AYyaZJpbu7CWXTLOchlgRtaRujNBWo2hilsVjvGqGQzpTWlTqEkMGqdaq0LtWeZeXMsIoW9vgmwYA5oxAt7JPhhP7fz5YhFPDENA/sMEulybNsxmAeSxeK6FELQmGt6k1rqhGqU1KLBcybMk+IKjSpFx2oWZFfYY5F7ZVBR/s3x8zRyRHd5tgc6/K6htbcMsYXW8TImGfQYNvE/iKEFO80UG2pz2Chvwhb2aWPFV4JmjtrsGVeyxf2kCDKFOfIvHNZdmG3zc7CYQ5JMUEyr1+W3YPdvS4lzBBkiQ2umTcLK2J2z0SlDQsg6llnnDibfJq8gLk/ZQAIhXWnDz1rRAHj8ArV6sbKPEcIDSmu3txAITRoZaXy7w+swy8gv1EedX78+PGWHxlpzR9umux+AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTAxLTAzVDA3OjE5OjU4KzAwOjAwyVHgCQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0wMS0wM1QwNzoxOTo1OCswMDowMLgMWLUAAAAASUVORK5CYII=",
					pngalignment: 'center:center',
					size:         '18',
					color:        '16777215',
					bgcolor:      '6245376',
				},
				actions:         [
					{
						action: 'start_forward',
					}
				],
				release_actions: [
					{
						action: 'stop_forward'
					}
				],
				feedbacks:       [
					{
						type:    'forwardStatus',
						options: self.getFeedbackDefaults('forwardStatus')
					}
				]
			},
			{
				category:  'Transport',
				label:     'Repeat',
				bank:      {
					style:        'png',
					text:         '',
					png64:        "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAQAAAAm93DmAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAHdElNRQfkAQUNES1VYcaAAAAByElEQVRIx+2VvWtTURiHn2tjDSSNVQqNVcRBUZeKkyAq+A+YWHFyExc3FwfRzUFL0So6F+MmCIKZ3KTgoIggIoi2sQ4iCFIoIrVKHod80CT3Nid20CG/s5x7zznP+3nuhb76+veKwrcadGhDjw6kWtHrBQ5xjcLayN6AK8B0N2SCjB9pp/xgofaUmJNOWF05tpFpqUGVMuPcBR7HE6NE3DBnOM1Yx44qGbYzS5HFuOOxHgI7mOYgD3nKYhsuyyUibvO9Zrxr34mY8b4vPRSTw01ed86iu7zjbkNKI+JJFzzegKxaGXTSj06IeV84GQocsOQDU+3bxSFvOFE3dMFXjoYBsz7zYmuoTd9TzXdHrTjeCYxr7IgUKwn2fjdnv4ABgoA/+cK++nyEc4w17DQGAHtY5lv3iGvhnPed+8WtlnztXtvXMWPZkqnQKucte8rN3vOtx2KaZ9DLVjwcVOU6csSdzrhgwZzDq8YWRz3ijJ88axQHTL56V7nCV+Y7spwmxzw3eUI18OpFNeRzPrPMI5bakD+Y4w1LCd6sETSe8L1TphM+ZKGwNmTFW2bXCWtBFp31wF8BEpCReTf2Alwzr2E/zr76+v/0BzeZK24hvqxqAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTAxLTAzVDA3OjIwOjA3KzAwOjAwEg7TTwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0wMS0wM1QwNzoyMDowNyswMDowMGNTa/MAAAAASUVORK5CYII=",
					pngalignment: 'center:center',
					size:         '18',
					color:        '16777215',
					bgcolor:      '0',
				},
				actions:   [
					{
						action: 'repeat',
					}
				],
				feedbacks: [
					{
						type:    'repeatStatus',
						options: self.getFeedbackDefaults('repeatStatus')
					}
				]
			},
			{
				category:  'Transport',
				label:     'Click',
				bank:      {
					style:        'png',
					text:         '',
					png64:        "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAB5UlEQVRYhe3XT6gNYRjH8Q8uNqxkgaIckZKysLARGwtbV4mQhT8rJeXWDQsLiY0/KQlJESuh7Ny6lIWFwsLGWSnlT5b+dqPRc2o6zZkzM2eckvnV9M4887zv8z3PeXuedzRq1KjRf65pRX9+u90u4rYFI7jTz7HVahWKO72QV3Hdwu06F6wTcCFmxf2SuhatE/ABXuE5ztW16EhdC+EljuMTvmA2vg+6aNUMzsRGrE7Z9uAtvuIbjg4KVxVwPd5gAi9wM8PnFMZq4CsNODfAFqds23Gsy+9kZHntsAE3YUaGfW/X88/I7sUB2P6oLOCHHvbPGbbDkcHCzSBLZQGf4FmGfTzD9ijGI8METLQBl5PuF8+H8LCH73WcGICvEmBSRvZjGW70qXVj0V1WDhMwraSc7Mp5n+zZj7hUNcCggK8xFbWxl8b7vP8rgOuwPO4nsS/H90qMB6oEqgp4L/ZhovNY0cf/Mc5UCVQFcBHmR+YSvY86uDNnzkHMwdJhAJ6N8X7KdhfbcuYkXeUXLpQNVgVwNCPQtSgleX/1aWwuG6ws4GiM3YeDH7iKVTlzOwV7d5mAZT+a3sWeW1MmSEpPI8vzin40lTlRb8WCuLL68VSMWaedjjrHrx09zpGNGjVq1OifEn4DaedMKGvZjBkAAAAASUVORK5CYII=",
					pngalignment: 'center:center',
					size:         '18',
					color:        '16777215',
					bgcolor:      '0',
				},
				actions:   [
					{
						action: 'click',
					}
				],
				feedbacks: [
					{
						type:    'clickStatus',
						options: self.getFeedbackDefaults('clickStatus')
					}
				]
			}


		];

		return presets;

	}
}