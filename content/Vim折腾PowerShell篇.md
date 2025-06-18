
+++
title="Vim折腾之 PowerShell篇"
date = 2025-06-17
+++

### 更新日志：

2022-09-03 晚

> - 调整目录结构
>
> - 更新文章封面



## 说明

> **vim一直以来都被称为编辑器之神一样的存在。但用不用vim完全取决于你自己，但是作为一个学计算机的同学来说，免不了会和Linux打交道，而大部分的Linux操作系统都预装了vim作为编辑器，如果是简单的任务，其实vim只要会**`:wq,i,o,w,q!,kjhl`足矣。
>
> ---
>
> **正式开始下面的内容之前，你可以考虑下要不要折腾，或者说是不是真的爱vim，如果不爱请离开，就现在，因为它真的带刺，没有足够的热爱就不会有足够的耐心和精力去维护和学习，vim很难学，但属于那种学会了就离不开的类型。**
>
> ---
>
> **再说下，IDE，使用vim的衍生产品neovim作为核心，结合plug.vim插件管理工具，继承一个功能强大的IDEA开发环境(几乎支持绝大部分编程语言哈)。**
>
> **总结一句话，这注定是一个折腾和学习的过程，要不要来，你决定。**

---

## windows版本

**相对来说，在windows系统上打造这样的环境相比于在Linxu上要麻烦得多，各种问题层出不穷，一言不合就就ERROR。所以这里先搞定windows操作系统，这里使用官方的**`powershell`作为shell终端，使用新版的`windows terminal`作为操作终端。

## 相关软件下载

* **windows terminal**
* **oh-my-posh**

> **以上两个软件可以直接在微软商店下载，下载安装即可，不需要作任何配置。**

**关于**`oh-my-posh`其实是`zsh`美化版本的`oh-my-zsh`，在linux上是zsh,在powershell中就是`oh-my-posh`,这是用来美化终端命令显示的，提供很多内置的主题。比如我用的`xtoys`效果如下：

![image-20220809095152202](https://b3logfile.com/file/2022/08/solo-fetchupload-10949903531096456410-d06f52e9.png)

## 配置oh-my-posh主题

**为了更好的兼容性，建议设置windows terminal字体为：**

![image-20220809102328823](https://b3logfile.com/file/2022/08/solo-fetchupload-13057622274987666226-30fd89da.png)

**具体的设置方法可以在终端设置中选择对于的终端，再选择外观设置。**

**接下来打开**`powershell`【为了方便，后面统一称为ps】。

**终端输入：**

```
notepad $PROFILE
```

**此时会弹出一个记事本，在里面输入：**

```
oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH\zash.omp.json" | Invoke-Expression
```

**保存之后输入**`.$PROFILE`使配置文件立即生效。

**再次重启ps之后就能看到设置的主题已经有效果了，上面这段命令中默认设置的主题是**`zash.omp.json`。

**使用**`Get-PoshThemes`可以在终端显示并查看所有主题效果，如果需要更换主题，找到对应的主题名称之后，替换掉前面配置文件中的`zash.omp.json`zash部分即可，这就是主题名称。

**更多内容可以阅读官方文档,官方文档才是最新鲜的第一手资料。**

[**Oh My Posh**](https://ohmyposh.dev/)

---

## **Chocolatey**的安装

`Chocolatey`是ps中一款包管理工具，通过这种方式来安装后续的很多内容可以避免踩很多坑，血的教训。

**一下的所有命令请在管理员模式下的ps终端执行**

> **安装****Chocolatey**

```
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

> **使用包管理工具安装下面几个软件**

```
choco install git
choco install neovim
choco install python
```

**注意上面的几个部分软件可能需要科学上网，请自己解决。在安装的过程中还会提示是否继续的操作指令提示，请全部选A，表示全部(ALL)继续的意思。**

**关于内容移步官网：**[https://chocolatey.org/install#psdsc](https://chocolatey.org/install#psdsc)

## 安装plug-vim

> **这是一款用来扩展nvim的插件管理器，nvim可以越发强大，主要就是靠插件的集成，也支持Lua脚本(对nvim和vim都有版本限制)，所以建议各位都安装vim8.3+或者neovim0.7+的版本。**

**按照官方文档的说明，安装这个插件的方式，对于使用ps而已，可以使用下面的安装命令：**

```
iwr -useb https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim |`
    ni "$(@($env:XDG_DATA_HOME, $env:LOCALAPPDATA)[$null -eq $env:XDG_DATA_HOME])/nvim-data/site/autoload/plug.vim" -Force
```

**安装完成后，会在**`$USER/nvim-data/site/autoload/`目录下生成一个`plug.vim`文件，注意`$USER`指的是你windows当前登录的用户所在的目录，这个USER指代的是当前用户的用户名，在C盘可以找到。

![image-20220809113811322](https://b3logfile.com/file/2022/08/solo-fetchupload-7718162306806339053-c5920d0f.png)

---

## 插件配置于安装

**使用插件功能，我们需要初始化一个配置文件，在**`C:$USER\AppData\Local\nvim\`目录下新建一个名为`init.vim`的配置文件。如果没有目录，就自己创建对应的目录。

> **打开init.vim，添加下面的内容，其中第一行用来指定安装的插件存放的位置，这个位置可以自定义，这个位置很重要，错误了可能后面无法安装插件。**

```
call plug#begin('~/.AppData/Local/nvim/plugged')

Plug '插件名称'
Plug '...'
"将所有插件安装在这里

call plug#end()
```

**插件安装位置: 在用户目录下，建立.AppData文件，在里面新建一个local文件，在local里新建一个nvim文件，在里新建一个plugged文件以存放下载的插件(C:\Users**(**你的用户名)**.**AppData\local\nvim\plugged)**

**安装插件：**

> **好用的插件太多了，各位可以去自己摸索或者去这个插件库找，下面放一下我自己的配置吧，插件有点多，这里不展开说，考虑另外开一篇文章来说一下插件的用法。**

```
set nu
call plug#begin('~/.AppData/Local/nvim/plugged')
set nu
" 要安装的插件列表
call plug#begin('~/.vim/plugged')
" tab键补全功能插件
"Plug 'ervandew/supertab'
Plug 'akinsho/toggleterm.nvim'
Plug 'linluk/vim-websearch'
"Plug 'kyazdani42/nvim-web-devicons'
" Coc 智能补全插件引擎
Plug 'neoclide/coc.nvim', {'branch': 'release'}
" vim-airline 标签栏插件
Plug 'Vim-airline/vim-airline'
" vim-airline 标签栏插件的主题插件
Plug 'Vim-airline/vim-airline-themes'
" ranger 文件浏览器
Plug 'kevinhwang91/rnvimr'
" vim-startify 插件
"Plug 'mhinz/vim-startify'
" vim-snazzy 主题插件
Plug 'connorholyday/vim-snazzy'
" markdown 预览插件
Plug 'iamcco/markdown-preview.nvim'
Plug 'preservim/nerdtree'
Plug 'Yggdroot/LeaderF', { 'do': './install.sh' }
Plug 'preservim/nerdcommenter'
Plug 'jiangmiao/auto-pairs'
Plug 'thinca/vim-quickrun'
Plug 'dhruvasagar/vim-table-mode'
Plug  'luochen1990/rainbow'
Plug 'mhinz/vim-startify'
Plug 'honza/vim-snippets'
Plug 'othree/html5.vim'
Plug 'shougo/neomru.vim'
Plug 'roxma/vim-paste-easy'
"Plug 'goolord/alpha-nvim'
Plug 'glepnir/dashboard-nvim'
"Plug 'cyrus-and/gdb-dashboard'
"Plug 'lukaszkorecki/vim-githubdashboard'
call plug#end()
" 配置 vim-airline 标签栏插件
"let g:airline#extensions#tabline#enabled = 1
" 配置 ranger 文件浏览器插件
let g:rnvimr_ex_enable = 1
" Alt+o 打开 ranger
nnoremap <silent> <M-o> :RnvimrToggle<CR>
"Alt+加号 切换至下一个标签，减号则是切换回上一个
nnoremap <M-+> :bp<CR>
nnoremap <M--> :bn<CR>
set background=light        " for the light version
let g:one_allow_italics = 1 " I love italic for comments
"colorscheme one
" 配置 vim-snazzy 主题插件
colorscheme snazzy
let g:SnazzyTransparent = 1
" 指定浏览器路径
let g:mkdp_path_to_chrome = "<此处填写chrome的安装路径>"
" 指定预览主题，默认Github
let g:mkdp_markdown_css=''

" Add spaces after comment delimiters by default
let g:NERDSpaceDelims = 1


" Use compact syntax for prettified multi-line comments
let g:NERDCompactSexyComs = 1


" Align line-wise comment delimiters flush left instead of following code indentation
let g:NERDDefaultAlign = 'left'


" Set a language to use its alternate delimiters by default
let g:NERDAltDelims_java = 1
" Allow commenting and inverting empty lines (useful when commenting a region)
let g:NERDCommentEmptyLines = 1


" Enable trimming of trailing whitespace when uncommenting
let g:NERDTrimTrailingWhitespace = 1
let g:coc_disable_startup_warning = 1

" Enable NERDCommenterToggle to check all selected lines is commented or not
let g:NERDToggleCheckAllLines = 1

" Add your own custom formats or override the defaults
let g:NERDCustomDelimiters = { 'c': { 'left': '/**','right': '*/' } }
set laststatus=2  "永远显示状态栏
let g:airline_powerline_fonts = 1  " 支持 powerline 字体
let g:airline#extensions#tabline#enabled = 1 "" 显示窗口tab和buffer
"let g:airline_theme='moloai'  " murmur配色不错
if !exists('g:airline_symbols')
let g:airline_symbols = {}
endif
let g:airline_left_sep = '▶'
let g:airline_left_alt_sep = '❯'
let g:airline_right_sep = '◀'
let g:airline_right_alt_sep = '❮'
let g:airline_symbols.linenr = '¶'
let g:airline_symbols.branch = '⎇'
map <C-n> :NERDTreeToggle<CR>
"let g:airline_theme='one'
" 配置彩虹括号
let g:rainbow_active = 1 "0 if you want to enable it later via :RainbowToggle
let g:rainbow_conf = {
\'guifgs': ['royalblue3', 'darkorange3', 'seagreen3', 'firebrick'],
\'ctermfgs': ['lightblue', 'lightyellow', 'lightcyan', 'lightmagenta'],
\'operators': '_,_',
\'parentheses': ['start=/(/ end=/)/ fold', 'start=/\[/ end=/\]/ fold', 'start=/{/ end=/}/ fold'],
\'separately': {
\'*': {},
\'tex': {
\'parentheses': ['start=/(/ end=/)/', 'start=/\[/ end=/\]/'],
\},
\'lisp': {
\'guifgs': ['royalblue3', 'darkorange3', 'seagreen3', 'firebrick', 'darkorchid3'],
\},
\'vim': {
\'parentheses': ['start=/(/ end=/)/', 'start=/\[/ end=/\]/', 'start=/{/ end=/}/ fold', 'start=/(/ end=/)/ containedin=vimFuncBody', 'start=/\[/ end=/\]/ containedin=vimFuncBody', 'start=/{/ end=/} fold containedin=vimFuncBody'],
\},
\'html': {
\'parentheses': ['start=/\v\<((area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)[ >])@!\z([-_:a-zA-Z0-9]+)(\s+[-_:a-zA-Z0-9]+(\=("[^"]*"|'."'".'[^'."'".']*'."'".'|[^ '."'".'"><=`]*))?)*\>/ end=#</\z1># fold'],
\},
\'css': 0,
\}
\}


"let g:dashboard_custom_section={
"\ 'buffer_list': [' Recently lase session SPC b b'],
"\ }

"let g:dashboard_custom_shortcut={
"\ 'yes'        :  'SPC s l',
"\}
"function! BUFFER_LIST()
"Clap buffers
"endfunction
let g:dashboard_default_header = 'commicgirl5'
let g:web_search_command = "firefox"
let g:web_search_query = "https://search.yahoo.com/search;?p="


let g:startify_custom_header = [
            \ '+------------------------------+',
            \ '|                              |',
            \ '| 惟有热爱,可岁月漫长！        |',
            \ '|                              |',
            \ '+----------------+-------------+',
            \]
let g:startify_custom_footer = [
            \ '+------------------------------+',
            \ '|      八尺妖剑                 | ',
    \ '|   https://www.waer.ltd         |',
            \ '+----------------+-------------+',
            \]
/

```

**把上面的内容粘贴到你的**`init.vim`中保存，然后重启nvim。

**在nvim命令模式下输入**`:PlugInstall`，它会自己安装所有的插件，过程也需要科学上网，并且可能不会一次成功，多试几次就好了。

![image-20220809120426366](https://b3logfile.com/file/2022/08/solo-fetchupload-14768138760641395538-eb6a9651.png)

**更多关于**`plug.vim`的管理命令参考官方:[https://github.com/junegunn/vim-plug](https://github.com/junegunn/vim-plug)

---

##  安装coc插件

> **注意到上一步安装的插件中一个个名为coc.nvim的插件。官方项目项目地址有这么一句话：**
>
> ![image-20220809120924743](https://b3logfile.com/file/2022/08/solo-fetchupload-5424929863086008846-d7ce9195.png)

**他是干什么用的现在懂了吧？？不过，有没有这种可能：你并不知道**`VSCode是什么？`希望没有！！！

**需要打造一款多语言环境的IDE，这小东西的可是功不可没。**

**官网地址,英文版直接去github项目地址就好了。**

[https://github.com/neoclide/coc.nvim](https://github.com/neoclide/coc.nvim)

**另外还提供中文讨论社区：**

[https://gitter.im/neoclide/coc-cn](https://gitter.im/neoclide/coc-cn)

**遇事不决，量子力学(官网解决)**

**代码提示/补全**

**由于 Coc 本身并不提供具体语言的补全功能，所以在安装完成后，我们需要安装具体的语言服务以支持对应的补全功能。例如想要配置 C++环境，我们就需要在 NeoVim 的命令模式下执行以下命令来安装相关的插件：**

```
:CocInstall coc-clangd # C++环境插件
:CocInstall coc-cmake  # Cmake 支持
```

**当然，你还可以安装：**

```
:CocInstall coc-git            # git 支持
:CocInstall coc-highlight  # 高亮支持
:CocInstall coc-jedi           # jedi
:CocInstall coc-json          # json 文件支持
:CocInstall coc-python     # python 环境支持
:CocInstall coc-sh             # bash 环境支持
:CocInstall coc-snippets   # python提供 snippets
:CocInstall coc-vimlsp      # lsp
:CocInstall coc-yaml         # yaml
:CocInstall coc-sql        # sql
:CocInstall coc-java      # java支持
更多内容去官方。
```

**上面的都安装完了，再次打开nvim，你会发现此时的vim已经是一款开发利器(我觉得是)。比如写个helloword.cpp试试看。**

![image-20220809122346987](https://b3logfile.com/file/2022/08/solo-fetchupload-8129814682304298084-0b6835d8.png)

**说实话，这提示可不必IDEA的提示慢。**

![](https://b3logfile.com/file/2022/08/solo-fetchupload-9678909763547725093-28a6431e.png)

**本文卒！**
