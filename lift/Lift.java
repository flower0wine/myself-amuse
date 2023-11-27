package lift;

/**
 * 电梯
 *
 * @author flowerwine
 * @date 2023 年 11 月 24 日
 */
class Lift {
    /**
     * 电梯当前所在楼层
     */
    private Layer currentLayer;
    /**
     * 电梯要去往的楼层
     */
    private Layer targetLayer;
    /**
     * 最大的楼层高度
     */
    private final Integer maxLayerNumber;
    /**
     * 电梯是否在使用, true 为正在移动, 有任务正在执行
     */
    private boolean using;

    /**
     * 电梯是否发生故障导致电梯不可运行, 默认值为 false
     */
    private boolean fault;
    /**
     * 楼层请求
     */
    private final LayerRequest layerRequest;
    /**
     * 当前电梯的移动方向, 初始化时为 {@link lift.MoveDirection#STOP}
     */
    private MoveDirection currentMoveDirection;
    /**
     * 所有的楼层, 楼层是初始化时创建好的, 后面不再新增楼层
     */
    private final LayerList layerList;

    /**
     * 单例电梯对象, volatile 使变量的改变在多个线程之间可见
     */
    private static volatile Lift lift;

    /**
     * 获取单例的电梯对象
     *
     * @return 返回生成的电梯对象
     */
    static Lift singleInstance(int maxLayerNumber) {
        if (lift == null) {
            synchronized (Lift.class) {
                if (lift == null) {
                    lift = new Lift(maxLayerNumber);
                }
            }
        }
        return lift;
    }

    private Lift(Integer maxLayerNumber) {
        this.maxLayerNumber = maxLayerNumber;
        this.layerRequest = LayerRequest.singleInstance(maxLayerNumber, this);
        this.layerList = LayerList.singleInstance(maxLayerNumber, this.layerRequest);
        this.setUsing(true);
        this.setFault(false);
        this.setCurrentMoveDirection(MoveDirection.STOP);
        this.setCurrentLayer(this.layerList.getFirst());
        this.setTargetLayer(this.getCurrentLayer());
    }

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

    /**
     * 电梯是否处于上升状态
     *
     * @return 上升中返回 true
     */
    public boolean isMoveUp() {
        return MoveDirection.isMoveUp(this.getCurrentMoveDirection());
    }

    /**
     * 电梯是否处于下降状态
     *
     * @return 下降中返回 true
     */
    public boolean isMoveDown() {
        return MoveDirection.isMoveDown(this.getCurrentMoveDirection());
    }

    /**
     * 电梯是否处于停止状态
     *
     * @return 停止时返回 true
     */
    public boolean isMoveStop() {
        return MoveDirection.isMoveStop(this.getCurrentMoveDirection());
    }

    /**
     * 电梯移动中
     */
    private void moving() {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    /**
     * 电梯经过每个楼层时调用的函数
     */
    private void passLayer(Layer layer) {
        System.out.println("经过第 " + layer.getLayerNumber() + " 层");
    }

    /**
     * 到达目标楼层调用的函数
     */
    private void reachTargetLayer() {
        System.out.println("已到达第 " + this.getCurrentLayer().getLayerNumber() + " 层");
        if (isMoveUp()) {
            this.layerRequest.removeUpLayer();
        } else if (isMoveDown()) {
            this.layerRequest.removeDownLayer();
        }
        this.setCurrentMoveDirection(MoveDirection.STOP);
    }

    /**
     * 检查楼层参数是否正确
     *
     * @param layer 楼层
     * @return 正确返回 true, 反之 false
     */
    private boolean checkLayer(Layer layer) {
        if (layer == null) {
            return false;
        }
        Integer layerNumber = layer.getLayerNumber();
        return checkLayerNumber(layerNumber);
    }

    /**
     * 检查楼层数是否正确, 不是索引, 区间为 [1, maxLayerNumber]
     *
     * @param layerNumber 层数
     * @return 在区间内返回 true
     */
    private boolean checkLayerNumber(Integer layerNumber) {
        return layerNumber != null && 0 < layerNumber && layerNumber <= maxLayerNumber;
    }

    /**
     * 设置目标楼层
     * @param layer 要设置的楼层
     * @return 设置成功返回 true, 失败返回 false
     */
    boolean setTargetLayer(Layer layer) {
        if (!this.getCurrentLayer().equals(layer)) {
            this.targetLayer = layer;
            return true;
        }
        return false;
    }

    /**
     * 如果 targetLayer 为 null 就设置值, 当电梯第一次使用时 targetLayer 为 null
     *
     * @param layer 要设置的参数
     */
    void setTargetLayerIfNull(Layer layer) {
        if (this.targetLayer == null) {
            this.setTargetLayer(layer);
        }
    }

    private void setCurrentLayer(Layer layer) {
        this.currentLayer = layer;
    }

    Layer getCurrentLayer() {
        return currentLayer;
    }

    Layer getTargetLayer() {
        return targetLayer;
    }

    public boolean isUsing() {
        return using;
    }

    void setUsing(boolean using) {
        this.using = using;
    }

    MoveDirection getCurrentMoveDirection() {
        return currentMoveDirection;
    }

    void setCurrentMoveDirection(MoveDirection currentMoveDirection) {
        this.currentMoveDirection = currentMoveDirection;
    }

    boolean isFault() {
        return fault;
    }

    void setFault(boolean fault) {
        this.fault = fault;
    }

    /**
     * 根据楼层 索引 获取楼层对象, 如果不在正确的区间范围内返回 {@link Lift#currentLayer} 的楼层对象
     *
     * @param layerIndex 楼层索引
     * @return 返回获取到的楼层对象
     */
    Layer getLayer(int layerIndex) {
        if (!this.checkLayerNumber(layerIndex + 1)) {
            layerIndex = this.getCurrentLayer().getLayerNumber() - 1;
        }
        return this.layerList.get(layerIndex);
    }
}
