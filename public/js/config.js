// 假设需要引入 Cookie 库（如果主题未在 HTML 模板中引入）
function exec_config() {
  const config = JSON.parse(Cookies.get("config") || "{}"); // 添加默认值防止解析错误
  Object.keys(config).map((key) => {
    const value = config[key];
    switch (key) {
      case "mouse":
        const html = document.getRootNode().documentElement;
        html.style = value ? "" : "cursor:none;pointer-events:none;";
        break;
      default:
    }
  });
}

const keys = {
  normal: {
    " ": (event, element) => {
      alert("u pressed space key");
    },
  },
  shortcut: {},
};

const commands = {
  test: (command) => {
    alert("you entered 'test' command");
    return {
      type: "success",
      message: "command executed",
    };
  },
};

function custom_init() {
  console.log("custom_init called");

  // 调用 exec_config 以应用 Cookie 配置
  exec_config();

  // 绑定键盘事件
  document.addEventListener("keydown", (event) => {
    if (keys.normal[event.key]) {
      keys.normal[event.key](event, document.activeElement);
    }
  });

  // 绑定命令行输入
  const commandInput = document.getElementById("command-input");
  if (commandInput) {
    commandInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const input = commandInput.value.trim();
        if (input.startsWith(":")) {
          const commandName = input.slice(1);
          if (commands[commandName]) {
            const result = commands[commandName](input);
            alert(`${result.type}: ${result.message}`);
            commandInput.value = ""; // 清空输入框
          } else {
            alert("error: unknown command");
          }
        }
      }
    });
  }
}

// 在页面加载完成后初始化
document.addEventListener("DOMContentLoaded", custom_init);
