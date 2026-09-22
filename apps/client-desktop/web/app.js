(function () {
  var state = {
    activeTicket: null
  };

  function byId(id) {
    return document.getElementById(id);
  }

  function setStatus(status) {
    var dot = byId("statusDot");
    var text = byId("statusText");
    var key = status || "Offline";
    var normalized = key.toLowerCase();

    dot.className = "status-dot " + normalized;
    text.innerText = translateStatus(key);
  }

  function translateStatus(status) {
    if (status === "Online") {
      return "ออนไลน์";
    }
    if (status === "Retrying") {
      return "กำลังเชื่อมต่อใหม่...";
    }
    return "ออฟไลน์";
  }

  function translateSender(senderType) {
    if (senderType === "Operator") {
      return "ผู้แจ้ง";
    }
    if (senderType === "Admin") {
      return "แอดมิน";
    }
    return "ระบบ";
  }

  function showChat(ticket) {
    state.activeTicket = ticket;
    byId("ticketBadge").innerText = "เคส: #" + ticket.id;
    byId("idlePanel").className = "panel hidden";
    byId("chatPanel").className = "panel";
  }

  function showIdle() {
    state.activeTicket = null;
    byId("chatHistory").innerHTML = "";
    byId("messageInput").value = "";
    byId("idlePanel").className = "panel";
    byId("chatPanel").className = "panel hidden";
  }

  function appendMessage(senderType, text, createdAt) {
    var history = byId("chatHistory");
    var item = document.createElement("div");
    var meta = document.createElement("span");
    var label = senderType === "Operator" ? "operator" : senderType === "Admin" ? "admin" : "system";

    item.className = "message " + label;
    item.appendChild(document.createTextNode(text));

    meta.className = "message-meta";
    meta.appendChild(document.createTextNode(translateSender(senderType) + " | " + (createdAt || "")));
    item.appendChild(meta);

    history.appendChild(item);
    history.scrollTop = history.scrollHeight;
  }

  function loadInitialState() {
    if (!window.pywebview || !window.pywebview.api) {
      window.setTimeout(loadInitialState, 200);
      return;
    }

    window.pywebview.api.get_initial_state().then(function (payload) {
      byId("stationName").innerText = payload.stationName;
      byId("operatorName").innerText = payload.operatorName;
      byId("shiftName").value = payload.shiftName;
      setStatus(payload.status);

      if (payload.activeTicket) {
        showChat(payload.activeTicket);
      }
    });
  }

  function startTicket() {
    var category = byId("issueCategory").value;
    var shiftName = byId("shiftName").value;

    window.pywebview.api.open_ticket(category, shiftName).catch(function (error) {
      appendMessage("System", error.message || "ไม่สามารถเริ่มแชทซัพพอร์ตได้", "");
    });
  }

  function sendMessage(event) {
    event.preventDefault();
    var input = byId("messageInput");
    var value = input.value.replace(/^\s+|\s+$/g, "");

    if (!value) {
      return;
    }

    window.pywebview.api.send_message(value).then(function () {
      input.value = "";
      input.focus();
    }).catch(function (error) {
      appendMessage("System", error.message || "ไม่สามารถส่งข้อความได้", "");
    });
  }

  function closeTicket() {
    window.pywebview.api.close_ticket().catch(function (error) {
      appendMessage("System", error.message || "ไม่สามารถปิดเคสได้", "");
    });
  }

  function hideWindow() {
    window.pywebview.api.hide_window();
  }

  function reportWindowActive(isActive) {
    if (!window.pywebview || !window.pywebview.api || !window.pywebview.api.set_window_active) {
      return;
    }

    window.pywebview.api.set_window_active(isActive).catch(function () {
      return null;
    });
  }

  window.etsClient = {
    receive: function (event) {
      if (!event || !event.name) {
        return;
      }

      if (event.name === "statusChanged") {
        setStatus(event.payload.status);
        return;
      }

      if (event.name === "ticketOpened") {
        showChat(event.payload.ticket);
        appendMessage("System", "เริ่มการสนทนา: " + event.payload.ticket.category, "");
        var messages = event.payload.messages || [];
        for (var i = 0; i < messages.length; i += 1) {
          appendMessage(messages[i].senderType, messages[i].messageText, messages[i].createdAt);
        }
        return;
      }

      if (event.name === "messageReceived") {
        appendMessage(
          event.payload.message.senderType,
          event.payload.message.messageText,
          event.payload.message.createdAt
        );
        return;
      }

      if (event.name === "ticketClosed") {
        appendMessage("System", "ปิดเคสแล้ว", "");
        showIdle();
      }
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    byId("startButton").addEventListener("click", startTicket);
    byId("messageForm").addEventListener("submit", sendMessage);
    byId("closeButton").addEventListener("click", closeTicket);
    byId("hideButton").addEventListener("click", hideWindow);
    window.addEventListener("focus", function () {
      reportWindowActive(true);
    });
    window.addEventListener("blur", function () {
      reportWindowActive(false);
    });
    reportWindowActive(document.hasFocus());
    loadInitialState();
  });
}());
