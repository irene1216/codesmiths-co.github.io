var myform = $('form#myform')
myform.submit(function (event) {
  event.preventDefault()

  var params = myform.serializeArray().reduce(function (obj, item) {
    obj[item.name] = item.value
    return obj
  }, {})

  // Change to your service ID, or keep using the default service
  var service_id = 'default_service'

  var template_id = 'template_tN5dwVOO'
  myform.find('button').text('Sending...')
  emailjs.send(service_id, template_id, params)
    .then(function () {
      alert('Thank you for your message 😊')
      myform.find('button').text('Send')
    }, function (err) {
      alert('Oh seems like something went wrong! Drop us a message at hello@codesmiths.co! \r\n Response:\n ' + JSON.stringify(err))
      myform.find('button').text('Send')
    })

  return false
})
