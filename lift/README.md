### 一、实现结果说明
这里首先说明实现结果：
#### 1、已实现：
- 实现电梯的移动逻辑。
- 实现了电梯外部的每个楼层的上下按钮。
- 实现了电梯运行的同时添加新楼层。
#### 2、未实现：
- 没有实现电梯内部的按钮。
- 没有实现多个电梯协同运行。
- 没有实现电梯开关门时的逻辑。
### 二、电梯运行的情况
- 当电梯向上移动时，会一直运行至发出请求的所有楼层中最高的楼层。
- 向下移动时，会一直运行至发生请求的所有楼层中最低的楼层。
- 在电梯运行过程中，如果有用户点击了某一层的按钮，会根据该层的按钮与当前电梯所在的层数和电梯要去的层数相比较，以及判断电梯的运行方向，来确定下一步去往的楼层。

### 三、实现说明
该代码实现使用 Java 编写，使用`多线程`来分析处理电梯的移动，以及各个楼层的按钮点击处理。

当然，没有展示的页面，Java 编写可视化页面还是相当吃翔的。采用`控制台输出`的方式来告诉开发者现在电梯所在的楼层。

实现代码中目前一共包含七个类（多数属于非严格的单例对象）：

- **Lift.java**：负责电梯的移动，从任务列表中取得任务，并判断电梯应该运行的方向。
- **LayerRequest.java**：这个类是定义的一个`数据结构`，用来保存每个楼层的请求。负责处理电梯获取或者删除任务的请求，以及各个楼层召唤电梯的请求。
- **LayerList.java**：该类保存着每个楼层。是一个继承了 ArrayList 的类。
- **Layer.java**：该类表示的是单个楼层，存储着某个楼层的信息。
- **MoveDirection.java**：电梯的移动方向，电梯的移动方向有三种：UP、DOWN、STOP。
- **Client.java**：客户端处理类，电梯与外界交互就靠这一个类，可以使用该类向电梯发送上升或者下降的请求。同时该类管理着一个线程池。
- **Test.java**：测试类。

### 四、部分代码解析
如果要查看源代码，可以从 CSDN 上下载 ZIP 文件 [CSDN —— Java 实现电梯逻辑](https://download.csdn.net/download/weixin_64433668/88571842?spm=1001.2014.3001.5503)。

同时也提供了 GitHub 项目地址：[GitHub —— Java 实现电梯逻辑](https://github.com/flower0wine/myself_amuse/tree/main/lift)。
#### 1、Lift.java 核心代码
```java
/**
     * 向上移动电梯
     */
    private void moveUp() {
        int currentLayerNumber = this.getCurrentLayer().getLayerNumber();
        int targetLayerNumber;
        while (currentLayerNumber < (targetLayerNumber = this.getTargetLayer().getLayerNumber())) {
            this.moving();
            Layer layer = this.layerList.get(currentLayerNumber);
            this.setCurrentLayer(layer);
            currentLayerNumber++;
            if (currentLayerNumber != targetLayerNumber) {
                this.passLayer(layer);
            }
        }
        this.reachTargetLayer();
    }

    /**
     * 向下移动电梯
     */
    private void moveDown() {
        int currentLayerNumber = this.getCurrentLayer().getLayerNumber();
        int targetLayerNumber;
        while (currentLayerNumber > (targetLayerNumber = this.getTargetLayer().getLayerNumber())) {
            this.moving();
            // 这里减二是因为：
            // 需要通过索引获取楼层, getLayerNumber() 对索引进行了加一, 需要减一获得索引,
            // 而这里是电梯下降, 需要获取下一个楼层的索引, 所以还要再减一
            Layer layer = this.layerList.get(currentLayerNumber - 2);
            this.setCurrentLayer(layer);
            currentLayerNumber--;
            if (currentLayerNumber != targetLayerNumber) {
                this.passLayer(layer);
            }
        }
        this.reachTargetLayer();
    }

    /**
     * 移动电梯到目标楼层
     */
    private void move(int diff) {
        if (diff > 0) {
            moveDown();
        } else {
            moveUp();
        }
    }

    /**
     * 电梯运行, 主要负责电梯的移动
     */
    void run() {
        while (this.runnable()) {
            try {
                this.setUsing(this.layerRequest.hasTask());
                if (!this.isUsing()) {
                    continue;
                }
                // 电梯有任务才会执行核心函数
                this.runCore();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 电梯是否可运行
     *
     * @return 可运行返回 true
     */
    private boolean runnable() {
        return !isFault();
    }

    /**
     * 电梯运行核心 (我是这样起名的, 它配不配这个名字我就不知道了)<br/>
     * 此时电梯一定处于 stop 状态
     */
    private void runCore() {
        Layer layer;
        LayerRequest layerRequest = this.layerRequest;
        int diff;
        int currentLayerNumber = this.getCurrentLayer().getLayerNumber();
        int targetLayerNumber = this.getTargetLayer().getLayerNumber();

        // 根据 当前楼层 与 目标楼层 的相对位置来设置电梯移动方向
        if ((diff = currentLayerNumber - targetLayerNumber) < 0) {
            layer = layerRequest.getLayer();
            if (layer != null) {
                this.setCurrentMoveDirection(MoveDirection.UP);
            } else {
                this.setCurrentMoveDirection(MoveDirection.DOWN);
            }
        } else if ((diff = currentLayerNumber - targetLayerNumber) > 0) {
            layer = layerRequest.getLayer();
            if (layer != null) {
                this.setCurrentMoveDirection(MoveDirection.DOWN);
            } else {
                this.setCurrentMoveDirection(MoveDirection.UP);
            }
        } else {
            return;
        }

        if (this.checkLayer(layer)) {
            this.setTargetLayer(layer);
            this.move(diff);
        }
    }

    /**
     * 检查楼层所属的区间, 下面是 layer 楼层所在的不同区间的所有的返回结果: <br/>
     * 一. [ (layer: -1) 低楼层 -- (layer: 0) --> 高楼层 (layer: 1) ] <br/>
     * 二. [ (layer: -1) 高楼层 -- (layer: 0) --> 低楼层 (layer: 1) ] <br/>
     * 三. 电梯处于 stop 状态时若电梯处于 stop 状态, 返回 layer 与 currentLayer 的楼层差值
     *
     * @param layer 要检查的楼层
     * @return 返回数字, 表示 layer 楼层所属的区间
     */
    int checkLayerInRange(Layer layer) {
        Layer currentLayer = this.getCurrentLayer();
        Layer targetLayer = this.getTargetLayer();
        int currentLayerNumber = currentLayer.getLayerNumber();
        int targetLayerNumber = targetLayer.getLayerNumber();

        int layerNumber = layer.getLayerNumber();

        // 上升时, 返回值取决于楼层 layer 所在的区间: [ (layer: -1) 低楼层 -- (layer: 0) --> 高楼层 (layer: 1) ]
        if (isMoveUp()) {
            if (layerNumber < currentLayerNumber) {
                return -1;
            } else if (targetLayerNumber < layerNumber) {
                return 1;
            } else {
                return 0;
            }
        }
        // 下降时, 返回值取决于 layer 所在的区间: [ (layer: -1) 高楼层 -- (layer: 0) --> 低楼层 (layer: 1) ]
        else if (isMoveDown()) {
            if (layerNumber < targetLayerNumber) {
                return 1;
            } else if (layerNumber > currentLayerNumber) {
                return -1;
            } else {
                return 0;
            }
        }
        // 若电梯处于 stop 状态, 返回 layerNumber 与 currentLayerNumber 的差值
        else {
            return layerNumber - currentLayerNumber;
        }
    }
```

#### 2、LiftRequest.java 核心代码
```java
void removeUpLayer() {
        this.removeLayer(this.nextUpList, this.nextDownList, MoveDirection.UP);
    }

    void removeDownLayer() {
        this.removeLayer(this.nextDownList, this.nextUpList, MoveDirection.DOWN);
    }

    /**
     * 电梯到达目标楼层时移除楼层, 从 usingList 中移除 <br/>
     * 当 usingList 中没有楼层时, 则设置 freeList 的第一个元素为 {@link Lift#targetLayer}, freeList 将成为 usingList<br/>
     *
     * @param nextUsingList 下一执行阶段要执行的任务
     * @param nextFreeList  下一执行阶段要执行的任务
     * @param moveDirection 当前电梯的运行状态
     */
    private void removeLayer(List<Layer> nextUsingList, List<Layer> nextFreeList,
                             MoveDirection moveDirection) {
        Lift lift = this.lift;
        List<Layer> taskList = this.taskList;

        // 当前任务执行完成, 将其移除
        removeFirst();

        // 移除后如果任务列表不为空, 就将列表第一个楼层设为目标楼层
        if (!taskList.isEmpty()) {
            lift.setTargetLayer(getFirst());
            return;
        }

        // 这段代码在下面的情况下生效 (电梯发生转向时):
        // 例如: 电梯从第一层移动到第七层, 在电梯到达第五层时, 此时在第三层按下向下的按钮, 将会添加到 nextFreeList 集合中
        if (!nextFreeList.isEmpty()) {
            taskList.addAll(nextFreeList);
            // 根据不同的移动状态排序
            if (MoveDirection.isMoveUp(moveDirection)) {
                this.reserveSort();
            } else if (MoveDirection.isMoveDown(moveDirection)) {
                this.sort();
            }
            lift.setTargetLayer(getFirst());
            nextFreeList.clear();
        }

        // 如果电梯反向运行列表没有元素 (nextFreeList 为空, empty), 就执行同向的任务列表
        // 例如: 电梯要从第一层移动到第七层, 并且电梯已经移动到第四层, 此时点击第一层的上升按钮和第三层的上升按钮,
        // 将会添加到 nextUsingList 集合中
        // 电梯移动过程: (1): 1 --- 上升 ---> 7  (2): 7 --- 下降 ---> 1  (3): 1 --- 上升 ---> 3
        if (taskList.isEmpty() && !nextUsingList.isEmpty()) {
            taskList.addAll(nextUsingList);
            if (MoveDirection.isMoveUp(moveDirection)) {
                this.sort();
            } else if (MoveDirection.isMoveDown(moveDirection)) {
                this.reserveSort();
            }
            lift.setTargetLayer(getFirst());
            nextUsingList.clear();
        }
    }

    /**
     * 添加楼层
     * @param layer 要添加的楼层
     * @param moveDirection 要去往的方向
     */
    void addLayer(Layer layer, MoveDirection moveDirection) {
        if (!this.taskList.contains(layer)) {
            Lift lift = this.lift;
            if (lift.getCurrentLayer().equals(layer)) {
                this.alreadyLocated(layer);
                return;
            }
            lift.setTargetLayerIfNull(layer);
            int result = lift.checkLayerInRange(layer);
            // 如果电梯处于停止状态
            if (lift.isMoveStop()) {
                if (result > 0) {
                    this.addUpLayerWithSort(layer);
                    lift.setCurrentMoveDirection(MoveDirection.UP);
                } else if (result < 0) {
                    this.addDownLayerWithSort(layer);
                    lift.setCurrentMoveDirection(MoveDirection.DOWN);
                }
                lift.setTargetLayer(layer);
                return;
            }
            // 根据按钮点击的是上升还是下降来调用
            if (MoveDirection.isMoveUp(moveDirection)) {
                this.addUpLayer(result, layer);
            } else {
                this.addDownLayer(result, layer);
            }
        }
    }

    /**
     * 添加要上楼的楼层
     *
     * @param result result
     * @param layer 要添加的楼层
     */
    private void addUpLayer(int result, Layer layer) {
        Lift lift = this.lift;
        if (lift.isMoveUp()) {
            if (result == 0) {
                lift.setTargetLayer(layer);
                this.addUpLayerWithSort(layer);
            } else if (result == 1) {
                this.addUpLayerWithSort(layer);
            } else if (result == -1) {
                this.addLayerIfNotExist(this.nextUpList, layer);
            }
        } else if (lift.isMoveDown()) {
            this.addLayerIfNotExist(this.nextUpList, layer);
        }
    }

    /**
     * 添加要下楼的楼层
     *
     * @param layer 要添加的楼层
     */
    void addDownLayer(int result, Layer layer) {
        Lift lift = this.lift;
        if (lift.isMoveDown()) {
            if (result == 0) {
                lift.setTargetLayer(layer);
                this.addDownLayerWithSort(layer);
            } else if (result == 1) {
                this.addDownLayerWithSort(layer);
            } else if (result == -1) {
                this.addLayerIfNotExist(this.nextDownList, layer);
            }
        } else if (lift.isMoveUp()) {
            this.addLayerIfNotExist(this.nextDownList, layer);
        }
    }
```

### 五、有话说

有兴趣的小伙伴可以自己写一个类似的程序，或者在此基础上做修改、加上新的处理逻辑，代码如有瑕疵，敬请见谅！
