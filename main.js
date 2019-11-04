try {
  const id = Math.floor(Math.random() * 100) + 1;
  document.querySelector(".app").innerText = "You are #" + id;
  var ipg = "gpch.herokuapp.com";
  var stream = undefined;
  var cl = [];
  var peer = new Peer(id, {
    host: ipg,
    path: "/myapp",
    secure: true,
  });
  peer.on("open", function(id) {
    console.log("My peer ID is:" + id);
  });
  peer.on("call", function(_call) {
    _call.answer(stream);
    _call.on("stream", function(_stream) {
      let _id = _call.peer;
      var int = undefined;
      add(_id, _stream);
      int = setInterval(() => {
        if (_call.remoteStream) {
          add(_id, _call.remoteStream);
          clearInterval(int);
        }
      }, 2000);
    });
  });
  var url = "wss://brodcsta.herokuapp.com";
  var ws = new WebSocket(url);
  regg();
  function regg() {
    ws.onmessage = function(m, e) {
      var l = JSON.parse(m.data)._CL;
      console.log(m, e);
      if (l) {
        document.querySelector(".ulist").innerHTML = l
          .map(j => "<div>" + j + "</div>")
          .join("");
        for (const _key in l) {
          let key = l[_key];
          if (document.getElementById("V" + key) == null) {
            console.log("calling" + key);
            placecall(key);
          }
        }
      }
    };
    ws.onopen = function() {
      ws.send(JSON.stringify({ _CL: [id] }));
      console.log("wssc open");
    };
  }
navigator.getUserMedia(config,
    st => {
      stream = st;
      add(id, st);
      try {
        ws.send(JSON.stringify({ _CL: [id] }));
      } catch (error) {}
    },
    e => {
      console.log(e);
    }
  );
  setInterval(() => {
    if (ws.readyState != 1) {
      ws = new WebSocket(url);
      setTimeout(() => {
        regg();
      }, 2000);
    }
    if (peer.disconnected) {
      peer = new Peer(id, {
        host: ipg,
        path: "/myapp",
        secure: true,
      });
    }
  }, 5000);
  function add(n, s) {
    let r = document.getElementById("V" + n);
    if (r == null) {
      let t = document
        .getElementById("streamer")
        .content.firstElementChild.cloneNode(true);
      t.id = "E" + n;
      t.getElementsByClassName("uname")[0].innerText = "#" + n;
      t.querySelector("video").id = "V" + n;
      t.querySelector("video").srcObject = s;
      s.oninactive = function(e) {
        document.getElementById(t.id).remove();
      };
      document.getElementsByClassName("flex")[0].append(t);
    }
  }
  window.onbeforeunload = () => end();
  window.onunload = () => end();
  window.onclose = () => end();
  function placecall(_id) {
    call = peer.call(_id, stream);
    let _call = call;
    console.log(call);
    if (call) {
      call.on("stream", function(_stream) {
        let _id = _call.peer;
        var int = undefined;
        add(_id, _stream);
        int = setInterval(() => {
          if (_call.remoteStream) {
            add(_id, _call.remoteStream);
            clearInterval(int);
          }
        }, 2000);
      });
    }
  }
  function end() {
    peer.close();
    ws.close();
  }

  function tog(e) {
    e.classList.toggle("on");
    document.getElementById("nobg").classList.toggle("hide");
  }
  function trymode(e) {

    config.video.facingMode=config.video.facingMode==='user'?'environment':'user';
  }
} catch (error) {
  alert(error);
}
